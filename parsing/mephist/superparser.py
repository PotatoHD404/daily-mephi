import copy
import json
import os

import unicodedata
from glob import glob


def main():
    with open('result1.json', encoding='utf-8') as json_data:
        mephist = json.load(json_data)
    with open('result2.json', encoding='utf-8') as json_data:
        mephist1 = json.load(json_data)
    # json_string = json.dumps(global_data['tutors'], indent=4, ensure_ascii=False)
    # mydata = unicodedata.normalize("NFKD", json_string)
    # print(global_data["tutors"][f"{1099}"])
    # for i in range(1099, 406, -1):
    #     global_data["tutors"][f"{i + 1}"] = global_data["tutors"][f"{i}"]
    for key in mephist1["tutors"].keys():
        del mephist1["tutors"][key]["Статы"]
        del mephist1["tutors"][key]["Отзывы"]
        del mephist1["tutors"][key]["Перлы"]
        # del mephist1["tutors"][key]["Факультет"]
        # del mephist1["tutors"][key]["Кафедра"]
        del mephist1["tutors"][key]["Материалы"]
        del mephist1["tutors"][key]["Информация"]
        del mephist1["tutors"][key]["Имена отзывов по почте"]
        del mephist1["tutors"][key]["mailMark"]
        del mephist1["tutors"][key]["mailVotesNumber"]

        mephist1["tutors"][key]["Оценка отзыва по почте"] = mephist[key]["Оценка отзыва по почте"]
        mephist1["tutors"][key]["Имена отзывов по почте"] = mephist[key]["Имена отзывов по почте"]
        mephist1["tutors"][key]["Характер"] = mephist[key]["Характер"]
        mephist1["tutors"][key]["Качество преподавания"] = mephist[key]["Качество преподавания"]
        mephist1["tutors"][key]["Приём зачётов/экзаменов"] = mephist[key]["Приём зачётов/экзаменов"]
        mephist1["tutors"][key]["mailReviews"] = mephist[key]["mailReviews"]

    # global_data['tutors'] = json.loads(json_string)
    json_string = json.dumps(mephist1, indent=4, ensure_ascii=False)
    mydata = unicodedata.normalize("NFKD", json_string)

    with open('result3.json', "w", encoding='utf-8') as file:
        file.write(mydata)
    pass


if __name__ == "__main__":
    main()
