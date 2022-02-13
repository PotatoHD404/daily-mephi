import sklearn
import pickle


def load_model(model_name):
    with open(model_name, 'rb') as pickle_file:
        model = pickle.load(pickle_file)

    return model


model = load_model('model.pkl')
vectorizer = load_model('vectorizer.pkl')

sentence = 'хороший'

sentence2 = 'пизда'


def predict_sentence(sentence, vectorizer, model):
    vector = vectorizer.transform([sentence])
    predict = model.predict(vector)
    return predict[0]  # 1 - toxic, 0 - not toxic


if __name__ == "__main__":
    print(predict_sentence(sentence, vectorizer, model))
    print(predict_sentence(sentence2, vectorizer, model))
