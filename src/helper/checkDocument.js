import { getDocuments, getStorage } from "../config/storage";
import { arkApi } from "../config/api";

const master = [
  {
    "id_document_type": "DOC-001",
    "name_document_type": "KTP"
  },
  {
    "id_document_type": "DOC-002",
    "name_document_type": "NPWP"
  },
  {
    "id_document_type": "DOC-003",
    "name_document_type": "Buku Tabungan"
  },
  {
    "id_document_type": "DOC-004",
    "name_document_type": "KK"
  },
  {
    "id_document_type": "DOC-005",
    "name_document_type": "Id Card"
  },
  {
    "id_document_type": "DOC-006",
    "name_document_type": "Buku Pernikahan"
  }
]

export const documentChecker = async () => {

  const finallDoc = async (list, data) => {
    let zeroList = [];
    for (let i in list) {
      let filter = data.filter(function (row) {
        return row.id_document_type == list[i].id_master_doc_type
      });
      if (filter.length === 0) {
        zeroList.push(list[i])
      }
    }
    return zeroList;
    // for (let i in data) {
    //   let filter = master.filter(function (row) {
    //     return row.id_document_type == data[i].id_document_type
    //   });
    //   if (filter.length >= 1) {
    //     data[i].name_document_type = filter[0].name_document_type
    //   } else {
    //     data[i].name_document_type = 'Undefined'
    //   }
    // }
    // return await data;
  }

  const getDocType = async (doc) => {

    let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'configDoc', param: null, body: null });

    if (res) {
      let data = res.config_registration[0].regist_document;
      for (let i in data) {
        let filter = master.filter(function (row) {
          return row.id_document_type == data[i].id_master_doc_type
        });
        if (filter.length >= 1) {
          data[i].name_document_type = filter[0].name_document_type
        } else {
          data[i].name_document_type = 'Undefined'
        }
      }
      return await finallDoc(data, doc);
    }
  }

  const getData = async () => {
    try {
      const payload = await getDocuments();
      if (payload) {
        let newDoc = [];
        for (let i in payload) {
          if (payload[i].id_document_type !== null) {
            newDoc.push(payload[i]);
          }
        }
        return await getDocType(newDoc);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return await getData();
};