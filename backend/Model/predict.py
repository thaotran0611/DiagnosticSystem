import argparse
import re
import tensorflow as tf

def read_dict_from_file(filename):
    result_dict = {}
    with open(filename, 'r') as file:
        for line in file:
            line = line.strip()
            if line:  # Skip empty lines
                key, value = line.split(' ')  # Assuming ":" is the delimiter
                result_dict[key.strip()] = int(value.strip())
    return result_dict

def clean_str(string):
    """
    Tokenization/string cleaning.
    """
    string = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", string)
    string = re.sub(r"\'s", " \'s", string)
    string = re.sub(r"\'ve", " \'ve", string)
    string = re.sub(r"n\'t", " n\'t", string)
    string = re.sub(r"\'re", " \'re", string)
    string = re.sub(r"\'d", " \'d", string)
    string = re.sub(r"\'ll", " \'ll", string)
    string = re.sub(r",", " , ", string)
    string = re.sub(r"!", " ! ", string)
    string = re.sub(r"\(", " ( ", string)
    string = re.sub(r"\)", " ) ", string)
    string = re.sub(r"\?", " ? ", string)
    string = re.sub(r"\s{2,}", " ", string)
    return string.strip()  # .lower() word2vec is case sensitive

def parse_text(texts, text):
    texts.append("<padding> " * args.padding + text + " <padding>" * args.padding)
    return texts

def preprocess(text):
    global args
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--padding', help="padding around each text", type=int, default=4)
    parser.add_argument('--batchsize', help="batchsize if you want to batch the data", type=int, default=1)
    parser.add_argument('--max_note_len', help="Cut off all notes longer than this (0 = no cutoff).", type=int,
                        default=0)
    parser.add_argument('--filename', help="File name for output file", type=str, default="new_data_2.h5")
    args = parser.parse_args()

    
    texts = []
    input = parse_text(texts, text)

    # CONVERT ALL THE TEXT
    lbl = []
    max_len_sent = 9805
    w2idx = read_dict_from_file('Model/words.dict')
    
    for i, t in enumerate(input):
        current_convert = [w2idx.get(w) for w in clean_str(t).split() if w2idx.get(w)]
        max_len_sent = max(max_len_sent, len(current_convert))
        lbl.append(current_convert)
        if i % 100 == 0:
            print ("CONVERTING ROW {}".format(i))
    print ("MAXIMUM TEXT LENGTH IS {}".format(max_len_sent))

    # ADD PADDING TO GET TEXT INTO EQUAL LENGTH
    for sent in lbl:
        if len(sent) < max_len_sent:
            sent.extend([2] * (max_len_sent - len(sent)))
    # CUT OFF NOTE IF CUTOFF > 0.
    if args.max_note_len > 0:
        print("SHORTENING NOTES FROM {} TO {}".format(max_len_sent, args.max_note_len))
        max_len_sent = min(args.max_note_len, len(sent))
        lbl = [sent[:max_len_sent] for sent in lbl]
    
    return lbl

def predict(text):
    lbl = preprocess(text)
    alcohol = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/alcohol')
    cancer = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/cancer')
    CN = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/CN')
    CP = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/CP')
    depression = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/depression')
    heart = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/heart')
    obesity = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/obesity')
    PD = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/PD')
    substance = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/substance')
    lung = tf.keras.models.load_model('Model/Result_w2v_200dim_newCNN/lung')


    lung_pred_probs = alcohol.predict(lbl)
    lung_pred_labels = tf.argmax(lung_pred_probs, axis=1).numpy()

    alcohol_pred_probs = alcohol.predict(lbl)
    alcohol_pred_labels = tf.argmax(alcohol_pred_probs, axis=1).numpy()

    cancer_pred_probs = cancer.predict(lbl)
    cancer_pred_labels = tf.argmax(cancer_pred_probs, axis=1).numpy()

    CN_pred_probs = CN.predict(lbl)
    CN_pred_labels = tf.argmax(CN_pred_probs, axis=1).numpy()

    CP_pred_probs = CP.predict(lbl)
    CP_pred_labels = tf.argmax(CP_pred_probs, axis=1).numpy()

    depression_pred_probs = depression.predict(lbl)
    depression_pred_labels = tf.argmax(depression_pred_probs, axis=1).numpy()

    heart_pred_probs = heart.predict(lbl)
    heart_pred_labels = tf.argmax(heart_pred_probs, axis=1).numpy()

    obesity_pred_probs = obesity.predict(lbl)
    obesity_pred_labels = tf.argmax(obesity_pred_probs, axis=1).numpy()

    PD_pred_probs = PD.predict(lbl)
    PD_pred_labels = tf.argmax(PD_pred_probs, axis=1).numpy()

    substance_pred_probs = substance.predict(lbl)
    substance_pred_labels = tf.argmax(substance_pred_probs, axis=1).numpy()

    predicts = {
        'AA': alcohol_pred_labels[0],
        'MC': cancer_pred_labels[0],
        'CND': CN_pred_labels[0],
        'CP': CP_pred_labels[0],
        'Dep': depression_pred_labels[0],
        'HD': heart_pred_labels[0],
        'Ob': obesity_pred_labels[0],
        'PD': PD_pred_labels[0],
        'SA': substance_pred_labels[0],
        'LD': lung_pred_labels[0]
    }

    return predicts
