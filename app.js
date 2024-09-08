//Bibliotecas del bot
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');

//bibliotecas para leer el excel
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Ruta al archivo de credenciales (archivo JSON)
const CREDENTIALS_PATH = path.join(__dirname, '/credenciales.json');
const SPREADSHEET_ID = '1hOCElQlezm2hJZkRTdZK1DogzH4t9uo6_l08-RTIKz8';
const RANGE = 'Hoja1!A1:F200';

// Configuración del cliente OAuth2
const CLIENT_ID = '55688410005-suhmke0rn1olson3iotgb8shsdf3apq4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const authorizeUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });

// Interfaz para lectura de entrada
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Variables globales para almacenar los datos
let volver_msg_1, volver_msg_2, menu_msg_1, menu_msg_2, menu_msg_3, prod_msg_1, prod_msg_2, prom_msg_1, prom_msg_2, prom_msg_3;
let prom_msg_4, prom_msg_5, prom_msg_6, prom_msg_7, prom_msg_8, prom_msg_9, prom_msg_10, prom_msg_11, prom_foto_1, prom_foto_2;
let prom_foto_3, prom_foto_4, prom_foto_5, prom_foto_6, prom_foto_7, prom_foto_8, prom_foto_9, prom_foto_10, pres_msg_1, pres_msg_2;
let pres_msg_3, faq_msg_1, faq_msg_2, faq_msg_3, faq_msg_4, faq_msg_5, faq_msg_6, faq_msg_7, faq_msg_8, faq_msg_9, faq_msg_10, faq_msg_11;
let faq_foto_1, faq_foto_2, faq_foto_3, faq_foto_4, faq_foto_5, faq_foto_6, faq_foto_7, faq_foto_8, faq_foto_9, faq_foto_10, ubi_msg_1, ubi_msg_2;

// Función para obtener el código de autorización del usuario
async function getAuthorizationCode() {
    console.log('Visita esta URL para autorizar la aplicación:');
    console.log(authorizeUrl);

    return new Promise((resolve) => {
        rl.question('Introduce el código de autorización aquí: ', (code) => {
            rl.close();
            resolve(code);
        });
    });
}

// Función para autenticar usando OAuth2
async function authenticate() {
    if (fs.existsSync('tokens.json')) {
        const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
        oAuth2Client.setCredentials(tokens);
    } else {
        const code = await getAuthorizationCode();
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync('tokens.json', JSON.stringify(tokens));
    }
    return oAuth2Client;
}

// Función para leer datos de Google Sheets
async function readSheetData() {
    const auth = await authenticate();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    });

    const rows = response.data.values;

     // Asigna las variables globales

    // mensajes de volver y volviendo
    volver_msg_1 = rows[4] ? rows[4][1] : 'No hay datos';   // Columna 5, Fila 5
    volver_msg_2 = rows[9] ? rows[9][1] : 'No hay datos';   // Columna 2, Fila 10

    //mensajes del menu
    menu_msg_1 = rows[14] ? rows[14][1] : 'No hay datos';   // Columna 2, Fila 15
    menu_msg_2 = rows[15] ? rows[15][1] : 'No hay datos';   // Columna 2, Fila 16
    menu_msg_3 = rows[16] ? rows[16][1] : 'No hay datos';   // Columna 2, Fila 17

    // mensajes de los productos
    prod_msg_1 = rows[21] ? rows[21][1] : 'No hay datos';   // Columna 2, Fila 22
    prod_msg_2 = rows[22] ? rows[22][1] : 'No hay datos';   // Columna 2, Fila 23

    // mensdajes de las promociones
    prom_msg_1 = rows[27] ? rows[27][1] : 'No hay datos';   // Columna 2, Fila 28
    prom_msg_2 = rows[28] ? rows[28][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_3 = rows[29] ? rows[29][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_4 = rows[30] ? rows[30][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_5 = rows[31] ? rows[31][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_6 = rows[32] ? rows[32][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_7 = rows[33] ? rows[33][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_8 = rows[34] ? rows[34][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_9 = rows[35] ? rows[35][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_10 = rows[36] ? rows[36][1] : 'No hay datos';   // Columna 2, Fila 29
    prom_msg_11 = rows[37] ? rows[37][1] : 'No hay datos';   // Columna 2, Fila 29
    //fotos de las promociones
    prom_foto_1 = rows[28] ? rows[28][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_2 = rows[29] ? rows[29][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_3 = rows[30] ? rows[30][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_4 = rows[31] ? rows[31][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_5 = rows[32] ? rows[32][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_6 = rows[33] ? rows[33][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_7 = rows[34] ? rows[34][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_8 = rows[35] ? rows[35][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_9 = rows[36] ? rows[36][3] : 'No hay datos';   // Columna 2, Fila 29
    prom_foto_10 = rows[37] ? rows[37][3] : 'No hay datos';   // Columna 2, Fila 29


    //mensajes de los presupuestos
    pres_msg_1 = rows[42] ? rows[42][1] : 'No hay datos';   // Columna 2, Fila 43
    pres_msg_2 = rows[43] ? rows[43][1] : 'No hay datos';   // Columna 2, Fila 44
    pres_msg_3 = rows[44] ? rows[44][1] : 'No hay datos';   // Columna 2, Fila 45

    // mensajes de las preguntas frecuentes
    faq_msg_1 = rows[50] ? rows[50][1] : 'No hay datos';    // Columna 2, Fila 51
    faq_msg_2 = rows[51] ? rows[51][1] : 'No hay datos';    // Columna 2, Fila 52
    faq_msg_4 = rows[52] ? rows[52][1] : 'No hay datos';  
    faq_msg_4 = rows[53] ? rows[53][1] : 'No hay datos';    
    faq_msg_5 = rows[54] ? rows[54][1] : 'No hay datos';  
    faq_msg_6 = rows[55] ? rows[55][1] : 'No hay datos';   
    faq_msg_7 = rows[56] ? rows[56][1] : 'No hay datos';    
    faq_msg_8 = rows[57] ? rows[57][1] : 'No hay datos'; 
    faq_msg_9 = rows[58] ? rows[58][1] : 'No hay datos';  
    faq_msg_10 = rows[59] ? rows[59][1] : 'No hay datos';  
    faq_msg_11 = rows[60] ? rows[60][1] : 'No hay datos';    
    //fotos faq
    faq_foto_1 = rows[51] ? rows[51][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_2 = rows[52] ? rows[52][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_3 = rows[53] ? rows[53][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_4 = rows[54] ? rows[54][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_5 = rows[55] ? rows[55][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_6 = rows[56] ? rows[56][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_7 = rows[57] ? rows[57][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_8 = rows[58] ? rows[58][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_9 = rows[59] ? rows[59][3] : 'No hay datos';   // Columna 2, Fila 29
    faq_foto_10 = rows[60] ? rows[60][3] : 'No hay datos';   // Columna 2, Fila 29

    //mensajes de la ubicación
    ubi_msg_1 = rows[65] ? rows[65][1] : 'No hay datos';    // Columna 2, Fila 66
    ubi_msg_2 = rows[66] ? rows[66][1] : 'No hay datos';    // Columna 2, Fila 67

}

// Llama a la función para leer los datos antes de iniciar el bot
const main = async () => {
    await readSheetData(); // Asegúrate de que los datos sean leídos antes de continuar
    console.log(menu_msg_1);

   //Flujo de volver
const flowVolver = addKeyword(["volver", "menu", "atrás", "1"])
.addAnswer(volver_msg_2, null, (ctx, { gotoFlow }) => { 
    return gotoFlow(flowPrincipal);
});

//Flujo de los productos
const flowProductos = addKeyword(["productos", "1", "marcas"])
.addAnswer(prod_msg_1)
.addAnswer(prod_msg_2)
.addAnswer(volver_msg_1, null, null, [flowVolver])
.addAnswer(null, null, () => {
    return endFlow();
});

//Flujo de las promociones
const flowPromociones = addKeyword(["promociones", "2"])
.addAnswer(prom_msg_1)
.addAnswer(prom_msg_2, { media: prom_foto_1 })
.addAnswer(prom_msg_3, { media: prom_foto_2 })
.addAnswer(prom_msg_4, { media: prom_foto_3 })
.addAnswer(prom_msg_5, { media: prom_foto_4 })
.addAnswer(prom_msg_6, { media: prom_foto_5 })
.addAnswer(prom_msg_7, { media: prom_foto_6 })
.addAnswer(prom_msg_8, { media: prom_foto_7 })
.addAnswer(prom_msg_9, { media: prom_foto_8 })
.addAnswer(prom_msg_10, { media: prom_foto_9 })
.addAnswer(prom_msg_11, { media: prom_foto_10 })
.addAnswer(volver_msg_1, null, null, [flowVolver])
.addAnswer(null, null, () => {
    return endFlow();
});

//Flujo de los presupuestos
const flowPresupuestos = addKeyword(["presupuestos", "3"])
.addAnswer(pres_msg_1)
.addAnswer(pres_msg_2)
.addAnswer(pres_msg_3)
.addAnswer(volver_msg_1, null, null, [flowVolver])
.addAnswer(null, null, () => {
    return endFlow();
});

//Flujo de las preguntas frecuentes
const flowFAQ = addKeyword(["preguntas", "4"])
.addAnswer(faq_msg_1)
.addAnswer(faq_msg_2, { media: faq_foto_1 })
.addAnswer(faq_msg_3, { media: faq_foto_2 })
.addAnswer(faq_msg_4, { media: faq_foto_3 })
.addAnswer(faq_msg_5, { media: faq_foto_4 })
.addAnswer(faq_msg_6, { media: faq_foto_5 })
.addAnswer(faq_msg_7, { media: faq_foto_6 })
.addAnswer(faq_msg_8, { media: faq_foto_7 })
.addAnswer(faq_msg_9, { media: faq_foto_8 })
.addAnswer(faq_msg_10, { media: faq_foto_9 })
.addAnswer(faq_msg_11, { media: faq_foto_10 })
.addAnswer(volver_msg_1, null, null, [flowVolver])
.addAnswer(null, null, () => {
    return endFlow();
});

//Flujo para saber la ubicación
const flowUbicacion = addKeyword(["ubicacion", "5"])
.addAnswer(ubi_msg_1)
.addAnswer(ubi_msg_2)
.addAnswer(volver_msg_1, null, null, [flowVolver])
.addAnswer(null, null, () => {
    return endFlow();
});


// Flujo del menu principal
const flowPrincipal = addKeyword([(EVENTS.WELCOME)])
.addAnswer(menu_msg_1)
.addAnswer(menu_msg_2)
.addAnswer(menu_msg_3, null, null, [flowProductos, flowPromociones, flowPresupuestos, flowUbicacion, flowFAQ]);




    // Se declaran algunas variables para que funcionen bien el servidor y la base de datos
    const adapterDB = new JsonFileAdapter();
    const adapterFlow = createFlow([flowPrincipal, flowVolver]);
    const adapterProvider = createProvider(BaileysProvider);

    // Esta es una función nativa que sirve para iniciar el bot
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Función para que nos pasen el QR
    QRPortalWeb();
};

// Se inicia la función principal del bot
main().catch(console.error);
