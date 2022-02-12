# Made by mmkuznecov

from sklearn import *
import pickle


def load_model(model_name):
    with open(model_name, 'rb') as pickle_file:
        model = pickle.load(pickle_file)

    return model


model = load_model('model.pkl')
vectorizer = load_model('vectorizer.pkl')

sentence = 'харош'


def predict_sentence(sentence):  # 1 - toxic, 0 - not toxic
    vector = vectorizer.transform([sentence])
    predict = model.predict(vector)
    return predict[0]


def main():
    print(predict_sentence(sentence))


if __name__ == "__main__":
    main()
    # print(dir(vectorizer))
    ...
