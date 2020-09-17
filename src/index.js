const express = require('express');
const pdf = require('html-pdf');/* Biblioteca que converte html em pdf */
const ejs = require('ejs');/* Biblioteca que permite usar variaveis em html */

const app = express();

/*
    Caminho do template ejs com código HTML
*/
const templatePath = './templates/index.ejs'; 
/* 
    Caminho do Relatório gerado 
*/
const reportGeneratedPath = './uploads/report.pdf';

app.use(express.json())
function renderizaPDF(response){
    /* Nesse objeto mapea todas as variaveis que o template ".ejs"*/
    const variaveisTemplate = {name: 'Edwin Lima - Render pdf'};
    ejs.renderFile(templatePath, variaveisTemplate, (error, html)=>{
        if(error){
            console.log(error);
            return response.status(500).json("Error in server.");            
        }
        /* Nesse objeto é onde é definido formato de papel no exemplo é A4 */
        const options = {
            format: 'A4',
            border:{
                right:'8'
            }
        };
        pdf.create(html, options).toFile(reportGeneratedPath,(error)=>{
            if(!error){
                return response.json({message:'PDF Generated successfully!'});
            }
            return response.status(500).json("Fail in Generate PDF file.");
        });
    }); 
}
app.post('/', (request, response) => {
    renderizaPDF(response);
});

app.get('/download', (request, response)=>{
    response.type('pdf')
    response.download(reportGeneratedPath);
})

app.listen(3333);