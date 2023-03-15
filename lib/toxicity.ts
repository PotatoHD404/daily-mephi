const googleApiKey = process.env.GOOGLE_API_KEY;

export async function getToxicity(text: string) {


    // fetch the link
    if (text === "") {
        return {
            "toxicity": 0,
            "severe_toxicity": 0,
            "threat": 0,
            "insult": 0,
            "profanity": 0
        };
    }
    const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${googleApiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "comment": {
                "text": text
            },
            "languages": [
                "en",
                "ru"
            ],
            "requestedAttributes": {
                "TOXICITY": {},
                "THREAT_EXPERIMENTAL": {},
                "SEVERE_TOXICITY_EXPERIMENTAL": {},
                "INSULT_EXPERIMENTAL": {},
                "PROFANITY_EXPERIMENTAL": {}
            }
        })
    });
    const data = await response.json();
    return {
        "toxicity": data.attributeScores.TOXICITY.summaryScore.value,
        "severe_toxicity": data.attributeScores.SEVERE_TOXICITY_EXPERIMENTAL.summaryScore.value,
        "threat": data.attributeScores.THREAT_EXPERIMENTAL.summaryScore.value,
        "insult": data.attributeScores.INSULT_EXPERIMENTAL.summaryScore.value,
        "profanity": data.attributeScores.PROFANITY_EXPERIMENTAL.summaryScore.value,
    };
}

export async function getToxicityFromText(text: string) {
    text = text.replace(/(\r\n|\n|\r)/gm, " ");
    const sentences = text.split(/(?<=\.)\s*/);
    const textParts: string[] = [];
    // add sentences to text parts
    let currentTextPart = "";
    for (let i = 0; i < sentences.length; i++) {
        let sentence = sentences[i];
        // console.log(sentence.length, currentTextPart.length)
        if (sentence.length > 280) {
            // if sentence is too long, split it by words and add to text parts
            const words = sentence.split(" ");
            for (const word of words) {
                if (word.length > 280) {
                    // if word is too long, split it by characters and add to text parts
                    const characters = word.split("");
                    for (const character of characters) {
                        if (currentTextPart.length + character.length > 280) {
                            textParts.push(currentTextPart);
                            currentTextPart = "";
                        }
                        currentTextPart += character;
                    }
                    if (currentTextPart.length > 0) {
                        textParts.push(currentTextPart);
                        currentTextPart = "";
                    }
                }
                if (currentTextPart.length + word.length > 280) {
                    textParts.push(currentTextPart);
                    currentTextPart = "";
                }
                if (currentTextPart.length > 0) {
                    currentTextPart += " ";
                }
                currentTextPart += word;
            }
            if (currentTextPart.length > 0) {
                textParts.push(currentTextPart);
            }
            currentTextPart = "";
            sentence = "";
        } else if (currentTextPart.length + sentence.length > 280) {
            textParts.push(currentTextPart);
            currentTextPart = "";
        }
        if (currentTextPart.length > 0) {
            currentTextPart += " ";
        }
        currentTextPart += sentence;
    }
    if (currentTextPart.length > 0) {
        textParts.push(currentTextPart);
    }
    // TODO: fix ... in the end of text
    // console.log(textParts);
    const toxicity = [];
    for (const textPart of textParts) {
        toxicity.push(getToxicity(textPart));
    }
    const toxicityData = await Promise.all(toxicity);

    // get average toxicity
    const resultToxicity = {
        "toxicity": 0,
        "severe_toxicity": 0,
        "threat": 0,
        "insult": 0,
        "profanity": 0,
    }
    const n = 2;
    for (const toxicityPart of toxicityData) {
        resultToxicity.toxicity += Math.pow(toxicityPart.toxicity, n);
        resultToxicity.severe_toxicity += Math.pow(toxicityPart.severe_toxicity, n);
        resultToxicity.threat += Math.pow(toxicityPart.threat, n);
        resultToxicity.insult += Math.pow(toxicityPart.insult, n);
        resultToxicity.profanity = Math.max(toxicityPart.profanity, resultToxicity.profanity);
    }
    const rootOfToxicity = Math.pow(toxicityData.length, 1 / n);
    resultToxicity.toxicity = Math.pow(resultToxicity.toxicity, 1 / n) / rootOfToxicity;
    resultToxicity.severe_toxicity = Math.pow(resultToxicity.severe_toxicity, 1 / n) / rootOfToxicity;
    resultToxicity.threat = Math.pow(resultToxicity.threat, 1 / n) / rootOfToxicity;
    resultToxicity.insult = Math.pow(resultToxicity.insult, 1 / n) / rootOfToxicity;
    return resultToxicity;
}

export async function isToxic(text: string) {
    const toxicity = await getToxicityFromText(text);
    return toxicity.toxicity > 0.6 ||
        toxicity.severe_toxicity > 0.5 ||
        toxicity.threat > 0.5 ||
        toxicity.insult > 0.5 ||
        toxicity.profanity > 0.5;
}
