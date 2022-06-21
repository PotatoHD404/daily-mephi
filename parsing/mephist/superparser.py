import copy
import json
import os

import unicodedata
from glob import glob


def main():
    with open('all_data3.json', encoding='utf-8') as json_data:
        global_data = json.load(json_data)
    tmp = {**global_data["materials"]}
    del global_data["materials"]
    global_data1 = {"tutors": global_data, "materials": tmp}
    json_string = json.dumps(global_data1, indent=4, ensure_ascii=False)

    mydata = unicodedata.normalize("NFKD", json_string)
    with open('all_data4.json', "w", encoding='utf-8') as file:
        file.write(mydata)
    pass


if __name__ == "__main__":
    main()
