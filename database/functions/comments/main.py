from google.cloud import firestore
client = firestore.Client()


# Converts strings added to /messages/{pushId}/original to uppercase
def make_upper_case(data, context):
    path_parts = context.resource.split('/documents/')[1].split('/')
    collection_path = path_parts[0]
    document_path = '/'.join(path_parts[1:])

    affected_doc = client.collection(collection_path).document(document_path)

    cur_value = data["value"]["fields"]["original"]["stringValue"]
    new_value = cur_value.upper()

    if cur_value != new_value:
        print(f'Replacing value: {cur_value} --> {new_value}')
        affected_doc.set({
            u'original': new_value
        })
    else:
        # Value is already upper-case
        # Don't perform a second write (which can trigger an infinite loop)
        print('Value is already upper-case.')