import json
import unicodedata

json_file = "parsed.json"

with open(json_file, encoding='utf-8') as json_data:
    # shutil.copyfileobj(json_data, sys.stdout)
    data = json.load(json_data)
    # print(data)

for group in data["groups"]:
    del data["groups"][group]['planLink']

    direction = data["groups"][group]['direction']
    array = direction.split('\n')

    form = array[2]

    start = array[6].index('«')
    end = array[6].index('»')
    new_direction = array[6][start + 1:end] # направление

    orientation = data["groups"][group]['orientation']
    list1 = orientation.split('\n')

    new_orientation = list1[2]

    data["groups"][group]['form'] = form
    data["groups"][group]['direction'] = new_direction
    data["groups"][group]['orientation'] = new_orientation

for tutor in data["tutors"]:
    FIO = data["tutors"][tutor]['fullName']
    array = FIO.split(' ')

    link = data["tutors"][tutor]['skypeLink']
    if link != None:
        linkList = link.split('/')
        nickName = linkList[3]
    else:
        nickName = None

    del data["tutors"][tutor]['fullName']
    del data["tutors"][tutor]['shortName']
    del data["tutors"][tutor]['skypeLink']
    data["tutors"][tutor]['cafedras'] = []
    data["tutors"][tutor]['directions'] = []
    data["tutors"][tutor]['name'] = array[1]
    data["tutors"][tutor]['lastName'] = array[0]
    data["tutors"][tutor]['nickName'] = nickName
    if len(array) >= 3:
        data["tutors"][tutor]['fatherName'] = ' '.join(array[2:])
    else:
        data["tutors"][tutor]['fatherName'] = None


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
# json_string.replace(u'\xa0', ' ')
mydate = unicodedata.normalize("NFKD", json_string)

with open('new.json', "w", encoding='utf-8') as file:
    file.write(mydate)
    # json.dump(data, file, sort_keys=True, indent=4, ensure_ascii=False)