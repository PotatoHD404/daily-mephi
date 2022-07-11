let resultData = {};
let docs = [];

async function func($x) {

    resultData['cafedras'] = {};
    let groupLinks = {};
    let tutorLinks = {};

    let items = $x('//*[@id="page-content-wrapper"]/div/div/div[3]/a');
    docs = await Promise.all(items.map(async el => {
        return (new DOMParser).parseFromString(await (await fetch(el.href)).text(), 'text/html');
    }));

    // docs = [document];

    // let docs = [(new DOMParser).parseFromString(await (await fetch(items[0])).text(), 'text/html')];


    for (let doc of docs) {
        let l = 1;
        let daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        while (daysCount === 0) {
            ++l;
            daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        }
        let res = {};
        for (let i = 5; i < daysCount + 5; ++i) {
            let lessonsCount = $x(`/html/body/div[${l}]/div/div/div[${i}]/div`, doc).length;
            for (let j = 1; j < lessonsCount + 1; ++j) {
                let subjectsCount = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div`, doc).length;
                // console.log(i, j, subjectsCount);
                for (let k = 1; k < subjectsCount + 1; ++k) {
                    // let m = 2;
                    let tutors = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/span/a[1]`, doc);


                    let subjectNode = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]`, doc)[0];

                    let groups = [];

                    $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`, doc).map(el => {
                        console.log(i, j, k);
                        let groupName = el.innerText.trim();
                        let groupLink = el.href;

                        let tutorCode = groupLink.split('study_groups/')[1].replace('/schedule', '');

                        if (!groupLinks.hasOwnProperty(tutorCode))
                            groupLinks[tutorCode] = {url: groupLink, name: groupName};
                        groups.push(tutorCode);
                    });

                    let subjectType = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/div[2]`, doc)[0].innerText;

                    let child = subjectNode.lastElementChild;
                    while (child) {
                        subjectNode.removeChild(child);
                        child = subjectNode.lastElementChild;
                    }
                    // console.log(subjectNode.innerText)
                    let subjectName = subjectType + "_" + (subjectNode.innerText.split('\n,')[0].replaceAll('\n', '') ?? subjectNode.innerText).trim();
                    tutors.forEach(el => {

                        let tutorLink = el.href;

                        let tutorName = el.innerText;

                        let tutorCode = tutorLink.split('tutors/')[1];

                        if (!tutorLinks.hasOwnProperty(tutorCode))
                            tutorLinks[tutorCode] = {url: tutorLink, shortName: tutorName}
                        res[tutorCode] = res[tutorCode] ?? {};
                        let newGroups = res[tutorCode][subjectName] ?? [];

                        newGroups.push(...groups);

                        res[tutorCode][subjectName] = [...new Set(newGroups)];

                        // console.log(res[tutorName][subjectName], tutorName, subjectName)
                        // console.log(tutorName, subjectName, res[tutorName][subjectName]);
                        // res.push(...$x(`/html/body/div[3]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`));
                    });


                }
            }

        }
        let cafedraName = $x(`/html/body/div[${l}]/div/div/div[3]/h1`, doc)[0].innerText.split('\nРасписание')[0].replaceAll('\n', '');

        resultData['cafedras'][cafedraName] = {tutors: res};
    }
    resultData = {...resultData, groups: groupLinks, tutors: tutorLinks}
}
await func($x)
resultData


async function func($x) {


    for (let [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {
        console.log(tutorCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
        resultData.tutors[tutorCode]['doc'] = doc;
        let skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
        // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
        resultData.tutors[tutorCode]['skypeLink'] =
            skypeIcon ? skypeIcon.parentNode.href : null;
        resultData.tutors[tutorCode]['fullName'] =
            $x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    }


    for (let [groupCode, groupData] of Object.entries(resultData['groups'])) {
        console.log(groupCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(groupData.url, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');
        resultData.groups[groupCode]['doc'] = doc;
        let planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;

        resultData.groups[groupCode]['planLink'] = planLink;
        let planDoc = (new DOMParser).parseFromString(await (await fetch(planLink, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');
        resultData.groups['groups'][groupCode]['planDoc'] = planDoc;

        // resultData
    }


}
await func($x)
resultData


async function func($x) {


    // for (let [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {
    //     console.log(tutorCode);
    //     let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
    //     resultData.tutors[tutorCode]['doc'] = doc;
    //     let skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
    //     // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
    //     resultData.tutors[tutorCode]['skypeLink'] =
    //         skypeIcon ? skypeIcon.parentNode.href : null;
    //     resultData.tutors[tutorCode]['fullName'] =
    //         $x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    // }


    for (let [groupCode, groupData] of Object.entries(resultData['groups'])) {
        console.log(groupCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(groupData.url, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');
        resultData.groups[groupCode]['doc'] = doc;
        // let planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;
        // let doc = resultData.groups[groupCode]['planDoc'];

        // if (!$x(`/html/body/div/div/div/div[2]/a/h4`, doc)[0]) {
        // console.log('we are here')
        let planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;

        resultData.groups[groupCode]['planLink'] = planLink;

        let planDoc = (new DOMParser).parseFromString(await (await fetch(planLink, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');

        resultData.groups[groupCode]['planDoc'] = planDoc;
        doc = resultData.groups[groupCode]['planDoc'];

        // }
        // console.log(planLink);
        console.log(doc)
        // Форма обучения; направление
        resultData.groups[groupCode]['direction'] = $x(`/html/body/div/div/div/div[2]/a/h4`, doc)[0].innerText

        // Направленность
        resultData.groups[groupCode]['orientation'] = $x(`/html/body/div/div/div/div[2]/a/div[1]`, doc)[0].innerText


        // resultData
    }


}

await func($x)
resultData

async function func($x) {


    for (let [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {

        console.log(tutorCode)
        let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');
        // let doc = resultData['tutors'][tutorCode]['doc'];

        console.log(doc)
        resultData['tutors'][tutorCode].url = $x(`/html/body/div/div/div/div[3]/h1/a`, doc)[0] ? $x(`/html/body/div/div/div/div[3]/h1/a`, doc)[0].href : null;

        // resultData
    }

}

await func($x)
resultData

async function func($x) {


    for (let [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {


        delete resultData['tutors'][tutorCode]['doc'];


        // resultData
    }

    for (let [groupCode, groupData] of Object.entries(resultData['groups'])) {

        delete resultData['groups'][groupCode]['doc'];
        delete resultData['groups'][groupCode]['planDoc'];

        // resultData
    }
}


await func($x)
resultData


async function func($x) {

    let keys = ['11840', '12037', '12234', '11839', '12231', '12092', '12055', '11804', '12089', '12067', '12038', '12083', '11749', '12062', '11808', '12085', '12058', '12056', '12054', '12063', '12087', '11716', '12113', '12045', '12141', '12105', '12235', '12230', '12061', '12059', '11836', '12091']

    for (let [groupCode, groupData] of Object.entries(resultData['groups']).filter(([key, value]) => {
        return keys.includes(key);
    })) {
        console.log(groupCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(groupData.url, {
            method: "GET",
            headers: {
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');
        resultData.groups[groupCode]['doc'] = doc;

        let planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;

        resultData.groups[groupCode]['planLink'] = planLink;

        let planDoc = (new DOMParser).parseFromString(await (await fetch(planLink, {
            method: "GET",
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                'Cookie': '_session_id=<session_id>'
            },
            credentials: 'include',
            mode: 'no-cors'
        })).text(), 'text/html');

        resultData.groups[groupCode]['planDoc'] = planDoc;
        doc = resultData.groups[groupCode]['planDoc'];

        // }
        // console.log(planLink);
        console.log(doc)
        // Форма обучения; направление
        resultData.groups[groupCode]['direction'] = $x(`/html/body/div/div/div/div[2]/a/h4`, doc)[0].innerText

        // Направленность
        resultData.groups[groupCode]['orientation'] = $x(`/html/body/div/div/div/div[2]/a/div[1]`, doc)[0].innerText


        // resultData
    }


}

await func($x)
resultData