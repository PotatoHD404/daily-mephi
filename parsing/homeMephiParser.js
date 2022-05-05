$x('//*[@id="page-content-wrapper"]/div/div/div[3]/a').map(el=>el.href) // get tutors from page


let cafedras = {};

let items = $x('//*[@id="page-content-wrapper"]/div/div/div[3]/a');
let docs = await Promise.all(items.map(async el => {
    return (new DOMParser).parseFromString(await (await fetch(el.href)).text(), 'text/html');
}));

docs.map(doc => {
    let l = 1;
    let daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
    while (daysCount === 0) {
        ++l;
        daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
    }
    let res = {};
    let groupLinks = {};
    for (let i = 5; i < daysCount + 5; ++i) {
        const lessonsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div`, doc).length;
        for (let j = 1; j < lessonsCount + 1; ++j) {
            const subjectsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div`, doc).length;
            // console.log(i, j, subjectsCount);
            for (let k = 1; k < subjectsCount + 1; ++k) {
                // let m = 2;
                const tutors = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div/span/a[1]`, doc);


                let subjectNode = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div[${k}]`, doc)[0];

                let groups = [];

                $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`, doc).map(el => {
                    console.log(i, j, k);
                    let groupName = el.innerText.trim();
                    let groupLink = el.href;
                    groupLinks[groupName] = groupLink;
                    groups.push(groupName);
                });

                let subjectType = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/div[2]`, doc)[0].innerText;

                let child = subjectNode.lastElementChild;
                while (child) {
                    subjectNode.removeChild(child);
                    child = subjectNode.lastElementChild;
                }
                const subjectName = subjectType + "_" + (subjectNode.innerText.split(' ,')[0] ?? subjectNode.innerText).trim();
                tutors.forEach(el => {

                    let tutorLink = el.href;

                    let tutorName = el.innerText;
                    res[tutorName] = res[tutorName] ?? {url: tutorLink};
                    let newGroups = res[tutorName][subjectName] ?? [];

                    newGroups.push(...groups);

                    res[tutorName][subjectName] = [...new Set(newGroups)];

                    // console.log(res[tutorName][subjectName], tutorName, subjectName)
                    // console.log(tutorName, subjectName, res[tutorName][subjectName]);
                    // res.push(...$x(`/html/body/div[3]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`));
                });


            }
        }

    }
    let cafedra = $x(`/html/body/div[${l}]/div/div/div[3]/h1`, doc)[0].innerText;

    cafedras[cafedra] = {tutors: res, groups: groupLinks};
})
JSON.stringify(cafedras);
cafedras




let copyCafedras = cafedras;
for (const [cafedraName, cafedraData] of Object.entries(copyCafedras)) {
    for (const [groupName, groupLink] of Object.entries(cafedraData['groups'])){
        console.log(groupName);
s    }


    for (const [tutorName, tutorData] of Object.entries(cafedraData['tutors'])){
        console.log(tutorName);
        copyCafedras[cafedraName]['tutors'][tutorName] = {...tutorData, doc: (new DOMParser).parseFromString(await (await fetch(tutorData['url'])).text(), 'text/html')}
    }
}
// await Promise.all(Object.entries(copyCafedras).map(async ([cafedraName, cafedraData]) => {
//     await Promise.all(Object.entries(cafedraData['groups']).map(async ([groupName, groupLink]) => {


//         copyCafedras[cafedraName]['groups'][groupName] = {link: groupLink, doc: (new DOMParser).parseFromString(await (await fetch(groupLink)).text(), 'text/html')}
//     }))

//         await Promise.all(Object.entries(cafedraData['tutors']).map(async ([tutorName, tutorData]) => {


//         copyCafedras[cafedraName]['tutors'][tutorName] = {...tutorData, doc: (new DOMParser).parseFromString(await (await fetch(tutorData['url'])).text(), 'text/html')}
//     }))

// }))
copyCafedras



async function func($x){
    let cafedras = {};
    let groupLinks = {};
    let tutorLinks = {};

    let items = $x('//*[@id="page-content-wrapper"]/div/div/div[3]/a');
    // let docs = await Promise.all(items.map(async el => {
    //     return (new DOMParser).parseFromString(await (await fetch(el.href)).text(), 'text/html');
    // }));

    let docs = [(new DOMParser).parseFromString(await (await fetch(el.href)).text(), 'text/html')];


    for(let doc of docs) {
        let l = 1;
        let daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        while (daysCount === 0) {
            ++l;
            daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        }
        let res = {};
        for (let i = 5; i < daysCount + 5; ++i) {
            const lessonsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div`, doc).length;
            for (let j = 1; j < lessonsCount + 1; ++j) {
                const subjectsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div`, doc).length;
                // console.log(i, j, subjectsCount);
                for (let k = 1; k < subjectsCount + 1; ++k) {
                    // let m = 2;
                    const tutors = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div/span/a[1]`, doc);


                    let subjectNode = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div[${k}]`, doc)[0];

                    let groups = [];

                    $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`, doc).map(el => {
                        console.log(i, j, k);
                        let groupName = el.innerText.trim();
                        let groupLink = el.href;

                        if(!groupLinks.hasOwnProperty(groupName))
                            groupLinks[groupName] = groupLink;
                        groups.push(groupName);
                    });

                    let subjectType = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/div[2]`, doc)[0].innerText;

                    let child = subjectNode.lastElementChild;
                    while (child) {
                        subjectNode.removeChild(child);
                        child = subjectNode.lastElementChild;
                    }
                    const subjectName = subjectType + "_" + (subjectNode.innerText.split('\n')[0] ?? subjectNode.innerText).trim();
                    tutors.forEach(el => {

                        let tutorLink = el.href;

                        let tutorName = el.innerText;

                        if(!tutorLinks.hasOwnProperty(tutorName))
                            tutorLinks[tutorName] = {url: tutorLink}
                        res[tutorName] = res[tutorName] ?? {};
                        let newGroups = res[tutorName][subjectName] ?? [];

                        newGroups.push(...groups);

                        res[tutorName][subjectName] = [...new Set(newGroups)];

                        // console.log(res[tutorName][subjectName], tutorName, subjectName)
                        // console.log(tutorName, subjectName, res[tutorName][subjectName]);
                        // res.push(...$x(`/html/body/div[3]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`));
                    });


                }
            }

        }
        let cafedra = $x(`/html/body/div[${l}]/div/div/div[3]/h1`, doc)[0].innerText;

        cafedras['cafedras'][cafedra] = {tutors: res};
    }
    cafedras = {...cafedras, groups: groupLinks, tutors: tutorLinks}
}
await func($x)
cafedras



let resultData = {};
async function func($x){

    resultData['cafedras'] = {};
    let groupLinks = {};
    let tutorLinks = {};

    let items = $x('//*[@id="page-content-wrapper"]/div/div/div[3]/a');
    let docs = await Promise.all(items.map(async el => {
        return (new DOMParser).parseFromString(await (await fetch(el.href)).text(), 'text/html');
    }));

    // let docs = [(new DOMParser).parseFromString(await (await fetch(items[0])).text(), 'text/html')];


    for(let doc of docs) {
        let l = 1;
        let daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        while (daysCount === 0) {
            ++l;
            daysCount = $x(`/html/body/div[${l}]/div/div/div[contains(@class, "list-group")]`, doc).length;
        }
        let res = {};
        for (let i = 5; i < daysCount + 5; ++i) {
            const lessonsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div`, doc).length;
            for (let j = 1; j < lessonsCount + 1; ++j) {
                const subjectsCount = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div`, doc).length;
                // console.log(i, j, subjectsCount);
                for (let k = 1; k < subjectsCount + 1; ++k) {
                    // let m = 2;
                    const tutors = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div/span/a[1]`, doc);


                    let subjectNode = $x(`//*[@id="page-content-wrapper"]/div/div[${i}]/div[${j}]/div[2]/div[${k}]`, doc)[0];

                    let groups = [];

                    $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/a`, doc).map(el => {
                        console.log(i, j, k);
                        let groupName = el.innerText.trim();
                        let groupLink = el.href;

                        if(!groupLinks.hasOwnProperty(groupName))
                            groupLinks[groupName] = {url: groupLink};
                        groups.push(groupName);
                    });

                    let subjectType = $x(`/html/body/div[${l}]/div/div/div[${i}]/div[${j}]/div[2]/div[${k}]/div[2]`, doc)[0].innerText;

                    let child = subjectNode.lastElementChild;
                    while (child) {
                        subjectNode.removeChild(child);
                        child = subjectNode.lastElementChild;
                    }
                    // console.log(subjectNode.innerText)
                    const subjectName = subjectType + "_" + (subjectNode.innerText.split('\n,')[0].replaceAll('\n', '') ?? subjectNode.innerText).trim();
                    tutors.forEach(el => {

                        let tutorLink = el.href;

                        let tutorName = el.innerText;

                        if(!tutorLinks.hasOwnProperty(tutorName))
                            tutorLinks[tutorName] = {url: tutorLink}
                        res[tutorName] = res[tutorName] ?? {};
                        let newGroups = res[tutorName][subjectName] ?? [];

                        newGroups.push(...groups);

                        res[tutorName][subjectName] = [...new Set(newGroups)];

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


    for(const [tutorName, tutorData] of Object.entries(resultData['tutors'])) {
        console.log(tutorName);
        let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
        resultData.tutors[tutorName]['doc'] = doc;
        const skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
        // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
        resultData.tutors[tutorName]['skypeLink'] =
            skypeIcon ? skypeIcon.parentNode.href: null;
        resultData.tutors[tutorName]['fullName'] =
            $x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    }


    for(const [groupName, groupData] of Object.entries(resultData['groups'])){
        console.log(groupName);
        let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
        resultData.groups[groupName]['doc'] = doc;
        const planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc])[0].href;

        resultData.groups[groupName]['planLink'] = planLink;
        let planDoc = (new DOMParser).parseFromString(await (await fetch(planLink)).text(), 'text/html');
        resultData.groups['groups'][groupName]['planDoc'] = planDoc;

        resultData
    }


}
await func($x)
resultData


async function func($x) {


    for(const [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {
        console.log(tutorCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
        resultData.tutors[tutorCode]['doc'] = doc;
        const skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
        // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
        resultData.tutors[tutorCode]['skypeLink'] =
            skypeIcon ? skypeIcon.parentNode.href: null;
        resultData.tutors[tutorCode]['fullName'] =
            $x(`/html/body/div/div/div/div[3]/h1`, tutorCode['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    }


    for(const [groupCode, groupData] of Object.entries(resultData['groups'])){
        console.log(groupCode);
        let doc = (new DOMParser).parseFromString(await (await fetch(groupData.url)).text(), 'text/html');
        resultData.groups[groupCode]['doc'] = doc;
        const planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;

        resultData.groups[groupCode]['planLink'] = planLink;
        let planDoc = (new DOMParser).parseFromString(await (await fetch(planLink)).text(), 'text/html');
        resultData.groups['groups'][groupCode]['planDoc'] = planDoc;

        // resultData
    }


}
await func($x)
resultData


async function func($x) {


    // for(const [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {
    //     console.log(tutorCode);
    //     let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
    //     resultData.tutors[tutorCode]['doc'] = doc;
    //     const skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
    //     // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
    //     resultData.tutors[tutorCode]['skypeLink'] =
    //     skypeIcon ? skypeIcon.parentNode.href: null;
    //     resultData.tutors[tutorCode]['fullName'] =
    //     $x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    // }


    for(const [groupCode, groupData] of Object.entries(resultData['groups'])){
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
        const planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;

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


    // for(const [tutorCode, tutorData] of Object.entries(resultData['tutors'])) {
    //     console.log(tutorCode);
    //     let doc = (new DOMParser).parseFromString(await (await fetch(tutorData.url)).text(), 'text/html');
    //     resultData.tutors[tutorCode]['doc'] = doc;
    //     const skypeIcon = $x(`/html/body/div/div/div/div[3]/div/div[1]/a/i[contains(@class, 'fa-skype')]`, doc)[0]
    //     // console.log($x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc']));
    //     resultData.tutors[tutorCode]['skypeLink'] =
    //     skypeIcon ? skypeIcon.parentNode.href: null;
    //     resultData.tutors[tutorCode]['fullName'] =
    //     $x(`/html/body/div/div/div/div[3]/h1`, tutorData['doc'])[0].textContent.split('Расписание')[0].replaceAll('\n', '').trim();
    // }


    for(const [groupCode, groupData] of Object.entries(resultData['groups'])){
        console.log(groupCode);
//         let doc = (new DOMParser).parseFromString(await (await fetch(groupData.url, {
//   method: "GET",
//   headers: {
//     // 'Accept': 'application/json',
//     // 'Content-Type': 'application/json',
//     'Cookie': '_session_id=<session_id>'
//   },
//   credentials: 'include',
//             mode: 'no-cors'
// })).text(), 'text/html');
//         resultData.groups[groupCode]['doc'] = doc;
        // const planLink = $x(`/html/body/div/div/div/div[4]/a[3]`, doc)[0].href;
        let doc = resultData.groups[groupCode]['planDoc'];

        if(!$x(`/html/body/div/div/div/div[2]/a/h4`, doc)[0]) {
            console.log('we are here')
            const planLink = resultData.groups[groupCode]['planLink'];
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

        }
        // console.log(planLink);
        console.log(doc)
        // Форма обучения; направление
        resultData.groups[groupCode]['direction']  = $x(`/html/body/div/div/div/div[2]/a/h4`, doc)[0].innerText

        // Направленность
        resultData.groups[groupCode]['orientation']  = $x(`/html/body/div/div/div/div[2]/a/div[1]`, doc)[0].innerText



        // resultData
    }


}
await func($x)
resultData