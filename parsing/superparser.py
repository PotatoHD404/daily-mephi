import copy
import json
import unicodedata

json_file = "parsed.json"
json_file1 = "parsed1.json"

with open(json_file, encoding='utf-8') as json_data:
    data = json.load(json_data)

with open(json_file1, encoding='utf-8') as json_data1:
    data1 = json.load(json_data1)

tempData = copy.deepcopy(data1)

for tutor, tutorsData in data["tutors"].items():
    url = data["tutors"][tutor]["url"]
    FIO = data["tutors"][tutor]["fullName"]
    for tutor1, tutorsData1 in tempData["tutors"].items():
        if tutor1 in data1["tutors"].keys():
            url1 = data1["tutors"][tutor1]["url"]
            FIO1 = data1["tutors"][tutor1]["fullName"]
            if url1 == url and FIO == FIO1:
                del data1["tutors"][tutor1]
                data1["tutors"][tutor] = tutorsData1
                for cafedra, cafData in tempData["cafedras"].items():
                    if tutor1 in cafData["tutors"].keys():
                        del data1["cafedras"][cafedra]["tutors"][tutor1]
                        data1["cafedras"][cafedra]["tutors"][tutor] = tempData["cafedras"][cafedra]["tutors"][tutor1]

            elif FIO == FIO1:
                print(FIO + " CRIIIINGE")

tempData = copy.deepcopy(data1)

for group, groupData in data["groups"].items():
    name = data["groups"][group]["name"]
    for group1, groupData1 in tempData["groups"].items():
        if group1 in data1["groups"].keys():
            name1 = data1["groups"][group1]["name"]
            if name1 == name:
                del data1["groups"][group1]
                data1["groups"][group] = groupData1
                for cafedra, cafData in tempData["cafedras"].items():
                    for tutor, tutorData in cafData["tutors"].items():
                        for subject, groups in tutorData.items():
                            if group1 in data1["cafedras"][cafedra]["tutors"][tutor][subject]:
                                data1["cafedras"][cafedra]["tutors"][tutor][subject].remove(group1)
                                data1["cafedras"][cafedra]["tutors"][tutor][subject].append(group)

diff = data1["groups"].keys() - data["groups"].keys()

tempData = copy.deepcopy(data)

dictGroups = data["groups"]
dictGroups1 = data1["groups"]
mergeGroups = {**dictGroups1, **dictGroups}

dictTutors = data["tutors"]
dictTutors1 = data1["tutors"]
mergeTutors = {**dictTutors1, **dictTutors}

data["groups"] = mergeGroups
data["tutors"] = mergeTutors

def getTutors(tdata):
    for cafedra, cafData in tdata["cafedras"].items():
        yield cafedra, tutors

def getSubjects(sdata):
    for cafedra, cafData in sdata["cafedras"].items():
        for tutor, subjects in cafData["tutors"].items():
            yield cafedra, tutor, subjects

def getGroups(gdata):
    for cafedra, cafData in gdata["cafedras"].items():
        for tutor, subjects in cafData["tutors"].items():
            for subject, groups in subjects.items():
                yield cafedra, tutor, subject, groups

for cafedra, cafData in tempData["cafedras"].items():
    for cafedra1, tutor1, subjecs1 in getSubjects(data1):
        if cafedra1 == cafedra:
            if tutor1 in cafData.keys():
                for subject1, groups1 in subjecs1.items():
                    subjects = tempData["cafedras"][cafedra]["tutors"][tutor1]
                    if subject1 in subjects.keys():
                        groups = set(subjects[subject1])
                        groupsSet = list(groups.union(set(groups1)))
                        data["cafedras"][cafedra]["tutors"][tutor1][subject1] = groupsSet
                    else:
                        data["cafedras"][cafedra]["tutors"][tutor1][subject1] = groups1
            else:
                data["cafedras"][cafedra]["tutors"][tutor1] = subjecs1



def tutor_parse(pdata):
    for tutor in pdata["tutors"]:
        FIO = pdata["tutors"][tutor]['fullName']

        array = FIO.split(' ')

        link = pdata["tutors"][tutor]['skypeLink']
        if link != None:
            linkList = link.split('/')
            nickName = linkList[3]
        else:
            nickName = None

        del pdata["tutors"][tutor]['fullName']
        del pdata["tutors"][tutor]['shortName']
        pdata["tutors"][tutor]['cafedras'] = []
        pdata["tutors"][tutor]['directions'] = []
        pdata["tutors"][tutor]['name'] = array[1]
        pdata["tutors"][tutor]['lastName'] = array[0]
        pdata["tutors"][tutor]['nickName'] = nickName
        if len(array) >= 3:
            pdata["tutors"][tutor]['fatherName'] = ' '.join(array[2:])
        else:
            pdata["tutors"][tutor]['fatherName'] = None


for group in data["groups"]:
    del data["groups"][group]['planLink']

    direction = data["groups"][group]['direction']
    array = direction.split('\n')

    form = array[2]

    start = array[6].index('«')
    end = array[6].index('»')
    new_direction = array[6][start + 1:end]  # направление

    orientation = data["groups"][group]['orientation']
    list1 = orientation.split('\n')

    new_orientation = list1[2]

    data["groups"][group]['form'] = form
    data["groups"][group]['direction'] = new_direction
    data["groups"][group]['orientation'] = new_orientation

tutor_parse(data)
# tutor_parse(data1)

result = {}

for cafedra, cafData in data["cafedras"].items():
    for tutor, subjects in cafData["tutors"].items():
        for subject, groups in subjects.items():
            for group in groups:
                group_name = data["groups"][group]["name"][:3]
                direction = data["groups"][group]["direction"] + "_" + group_name
                if direction not in result.keys():
                    result[direction] = set()
                result[direction].add(tutor)

for direction, tutors in result.items():
    result[direction] = list(tutors)

data['directions'] = result

for cafedra, cafData in data["cafedras"].items():
    for tutor, subjects in cafData["tutors"].items():
        data["tutors"][tutor]['cafedras'].append(cafedra)

for direction, tutors in data["directions"].items():
    for tutor in tutors:
        data["tutors"][tutor]["directions"].append(direction)

json_string = json.dumps(data, indent=4, ensure_ascii=False)
json_string1 = json.dumps(data1, indent=4, ensure_ascii=False)

mydate = unicodedata.normalize("NFKD", json_string)
mydate1 = unicodedata.normalize("NFKD", json_string1)

with open('new1.json', "w", encoding='utf-8') as file:
    file.write(mydate)
    # json.dump(data, file, sort_keys=True, indent=4, ensure_ascii=False)
