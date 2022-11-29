import FileSaver from "file-saver";
import xmlbuilder from "xmlbuilder";
import moment from "moment";
import { axios_Prom } from "../../api/api";

const pf = (p, fix = 2) => {
  return parseFloat(p)?.toFixed(fix);
};

function genCodeAndName(invoice_code, invoice_fileName) {
  try {
    let newCode, newFileName;
    // code
    if (invoice_code) {
      newCode = "000000" + String(parseInt(invoice_code) + 1);
      newCode = newCode.slice(newCode.length - 6);
    } else newCode = "000000";
    //file name
    if (invoice_fileName) {
      const fileNameArr = [];
      let shouldIncrement = false;
      //----------------------a to z------A to Z
      const patternAll = /[0-9]|[\x61-\x7A]|[\x41-\x5A]/;
      const patternJump = /9|\x7A|\x5A/;

      for (let i = 0; i < invoice_fileName.length; i++) {
        const j = invoice_fileName.length - 1 - i; //reverse order
        const char = invoice_fileName[j];
        if (!char.match(patternAll)) throw new Error("Invalid pattern");
        //only inc when at last position or shouldIncrement
        if (i !== 0 && !shouldIncrement) {
          fileNameArr.unshift(char);
          continue;
        }
        let newChar = "";
        if (char.match(patternJump)) {
          if (char.match(/9/)) newChar = "a";
          else if (char.match(/\x7A/)) newChar = "A";
          else if (char.match(/\x5A/)) {
            newChar = "0";
            fileNameArr.unshift(newChar);
            //set next increment and continue
            shouldIncrement = true;
            continue;
          }
        } else {
          let num = char.charCodeAt();
          num++;
          newChar = String.fromCharCode(num);
        }
        shouldIncrement = false;
        fileNameArr.unshift(newChar);
      }
      newFileName = fileNameArr.join("");
    } else newFileName = "00000";

    return { newCode, newFileName };
  } catch (e) {
    return { newCode: "000000", newFileName: "00000" };
  }
}

function genFileObj(shopInfo, customerInfo, order, newCode) {
  const {
    vat,
    fc,
    addr: addrS,
    email: emailS,
    tel: telS,
    country: countryS,
    province: provinceS,
    city: cityS,
    zip: zipS,
    name,
  } = shopInfo || {};
  const {
    type,
    nomeC,
    pIva,
    addr: addrC,
    emailLaw,
    tel: telC,
    country: countryC,
    province: provinceC,
    city: cityC,
    zip: zipC,
    receiverCode,
  } = customerInfo || {};
  const { order_imp, code, _id, OrderProds, crt_at } = order || {};
  const IdTrasmittente = {
    IdPaese: countryS,
    IdCodice: vat,
  };
  const DatiTrasmissione = {
    IdTrasmittente,
    ProgressivoInvio: newCode,
    FormatoTrasmissione: "FPR12",
    CodiceDestinatario: receiverCode,
  };
  // * ------------------------------ shop
  //个人资料 shop
  const DatiAnagraficiS = {
    IdFiscaleIVA: {
      IdPaese: countryS,
      IdCodice: vat,
    },
    CodiceFiscale: fc,
    Anagrafica: {
      Denominazione: name,
    },
    RegimeFiscale: "RF01",
  };
  //地点 shop
  const SedeS = {
    CAP: zipS,
    Indirizzo: addrS,
    Comune: cityS,
    Provincia: provinceS?.toUpperCase(),
    Nazione: countryS?.toUpperCase(),
  };

  const ContattiS = {
    Email: emailS || "",
  };

  // * ------------------------------ customer
  //个人资料 customer
  const DatiAnagraficiC = {
    IdFiscaleIVA: {
      IdPaese: countryC,
      IdCodice: pIva,
    },
    CodiceFiscale: pIva,
    Anagrafica: {
      ...(type === "company"
        ? { Denominazione: nomeC }
        : { Nome: "", Cognome: "" }),
    },
  };
  //地点 customer
  const SedeC = {
    CAP: zipC,
    Indirizzo: addrC?.toUpperCase(),
    Comune: cityC?.toUpperCase(),
    Provincia: provinceC?.toUpperCase(),
    Nazione: countryC?.toUpperCase(),
  };

  const ContattiC = {
    Email: emailLaw || "",
  };

  // * ------------------------------ order data
  const DatiGeneraliDocumento = {
    TipoDocumento: "TD01",
    Divisa: "EUR",
    Data: moment(crt_at)?.format("YYYY-MM-DD"),
    Numero: `1/${name?.slice(0, 1)}`,
    ImportoTotaleDocumento: pf(order_imp),
    Arrotondamento: pf(0),
  };

  // * ------------------------------ prods
  const DettaglioLinees = OrderProds.map((op, index) => {
    const { nome, price, code, quantity, iva } = op;
    return {
      NumeroLinea: index + 1,
      CodiceArticolo: {
        CodiceTipo: "Fattura",
        CodiceValore: code,
      },
      Descrizione: nome,
      Quantita: pf(quantity, 3),
      PrezzoUnitario: pf(price, 3),
      PrezzoTotale: pf(quantity * price, 3),
      AliquotaIVA: pf(iva),
    };
  });

  // * ------------------------------ tax
  const DatiRiepilogos = [0.22, 0.04, 0.1].map((rate) => {
    let taxBase = 0,
      tax = 0;
    OrderProds.forEach((op) => {
      if (op.iva === rate) {
        let curBase = op.price / (1 + rate);
        let curTax = op.price - curBase;
        taxBase += curBase;
        tax += curTax;
      }
    });
    return {
      DatiRiepilogo: {
        AliquotaIVA: pf(rate * 100),
        SpeseAccessorie: pf(0),
        ImponibileImporto: pf(taxBase),
        Imposta: pf(tax),
      },
    };
  });

  // * ------------------------------ payments
  const DettaglioPagamento = {
    ModalitaPagamento: "MP01",
    ImportoPagamento: order_imp,
  };

  const baseTemplate = {
    "ns3:FatturaElettronica": {
      // attrs
      "@xmlns:ns3":
        "http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2",
      "@xmlns:ns2": "http://www.w3.org/2000/09/xmldsig#",
      "@xmlns:ns4": "http://www.fatturapa.gov.it/sdi/messaggi/v1.0",
      "@xmlns:ns5":
        "http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fattura/messaggi/v1.0",
      "@xmlns:ns6": "http://www.fatturapa.gov.it/sdi/ws/ricezione/v1.0/types",
      "@xmlns:ns7":
        "http://www.fatturapa.gov.it/sdi/ws/trasmissione/v1.0/types",
      "@version": "FPR12",
      // children
      FatturaElettronicaHeader: {
        DatiTrasmissione,
        // shop info
        CedentePrestatore: {
          DatiAnagrafici: DatiAnagraficiS,
          SedeS,
          ContattiS,
        },
        CessionarioCommittente: {
          DatiAnagrafici: DatiAnagraficiC,
          Sede: SedeC,
          Contatti: ContattiC,
        },
      },
      FatturaElettronicaBody: {
        DatiGenerali: {
          DatiGeneraliDocumento,
        },
        DatiBeniServizi: [...DettaglioLinees, ...DatiRiepilogos],
        DatiPagamento: {
          CondizioniPagamento: "TP01",
          DettaglioPagamento,
        },
      },
    },
  };
  return baseTemplate;
}

async function updateCodeAndName(invoice_code, invoice_fileName, Order_id) {
  console.log(invoice_code, invoice_fileName);
  const updateRes = await axios_Prom("/invoiceOrder", "POST", {
    invoice_code,
    invoice_fileName,
    Order_id,
  });

  console.log(updateRes);
}

export default async function generateInvoice(shopId, customerInfo, order) {
  try {
    if (!shopId || !customerInfo || !order) return false;
    //get prev invoice code
    const shopRes = await axios_Prom(`/shop/${shopId}`);
    if (shopRes?.status !== 200) return false;
    const shopInfo = shopRes.data.object;
    const { invoice_code, invoice_fileName } = shopInfo;
    //get new code and name
    console.log(invoice_code, invoice_fileName);
    const { newCode, newFileName } = genCodeAndName(
      invoice_code,
      invoice_fileName
    );
    //get file
    const fileObj = genFileObj(shopInfo, customerInfo, order, newCode);
    const xml = xmlbuilder
      .create(fileObj, { encoding: "utf8" })
      .end({ pretty: true });
    const blob = new Blob([xml], { type: "text/xml;charset=utf8" });
    FileSaver.saveAs(blob, `IT${shopInfo.vat}_${newFileName}.xml`);
    updateCodeAndName(newCode, newFileName, order._id);
  } catch (e) {
    console.log(e);
  }
}
