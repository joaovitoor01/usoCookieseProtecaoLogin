import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaProdutos = [];


const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }
    else{
       resposta.redirect('/login.html');
    }
}

function cadastrarProduto(requisicao, resposta){
    const codigo_barras = requisicao.body.codigo_barras;
    const descricao = requisicao.body.descricao;
    const preco_custo = requisicao.body.preco_custo;
    const preco_venda = requisicao.body.preco_venda;
    const data_validade = requisicao.body.data_validade;
    const qtd_estoque = requisicao.body.qtd_estoque;
    const fabricante = requisicao.body.fabricante;


    if (codigo_barras && descricao && preco_custo && preco_venda && data_validade && qtd_estoque && fabricante) 
    {
        listaProdutos.push({
            codigo_barras: codigo_barras,
            descricao: descricao,
            preco_custo: preco_custo,
            preco_venda: preco_venda,
            data_validade: data_validade,
            qtd_estoque: qtd_estoque,
            fabricante: fabricante
        });
        resposta.redirect('/listarProdutos');
    }
    else
    {
        resposta.write(`
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página de cadastro de produtos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>
    <div class="container m-5">
        <form method="POST" action='/cadastrarProduto' class="border row g-3 needs-validation" novalidate>
            <legend>Cadastro de Produtos</legend>
            <div class="col-md-4">
                <label for="codigo_barras" class="form-label">Código de Barras:</label>
                <input type="text" class="form-control" id="codigo_barras" name="codigo_barras" value="${codigo_barras}" required>`);
        if (codigo_barras == ""){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o Código de Barras.
                        </div>
            `);
        }
        resposta.write(`</div>
        <div class="col-md-4">
            <label for="descricao" class="form-label">Descrição do Produto:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}" required>`);
        if (descricao == ""){
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                Por favor, informe a descrição do Produto.
                            </div>`);
        }        
        resposta.write(`
        </div>
        <div class="col-md-4">
            <label for="preco_custo" class="form-label">Preço de Custo:</label>
            <input type="number" step="0.01" class="form-control" id="preco_custo" name="preco_custo" value"${preco_custo}" required>
        `);            
        if (preco_custo == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o preço de custo do produto.
                            </div>`);
        }
        resposta.write(`  </div>
        <div class="col-md-4">
            <label for="preco_venda" class="form-label">Preço de Venda:</label>
            <input type="number" step="0.01" class="form-control" id="preco_venda" name="preco_venda" value"${preco_venda}" required>`
        );
        if (preco_venda == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o preço de venda do produto.
                            </div>`);
        }
        resposta.write(`</div>
        <div class="col-md-4">
            <label for="data_validade" class="form-label">Data de Validade:</label>
            <input type="date" class="form-control" id="data_validade" name="data_validade" value"${data_validade}" required>`
        );
        if (data_validade == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe a data de validade do produto.
                            </div>`);
        }
        resposta.write(`</div>
        <div class="col-md-4">
            <label for="qtd_estoque" class="form-label">Quantidade em Estoque:</label>
            <input type="number" class="form-control" id="qtd_estoque" name="qtd_estoque" value "${qtd_estoque}"required>
            `);
        if (qtd_estoque == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe a quantidade em estoque.
                            </div>`);
        }

        resposta.write(`</div>
        <div class="col-md-4">
            <label for="fabricante" class="form-label">Nome do Fabricante:</label>
            <input type="text" class="form-control" id="fabricante" name="fabricante" value"${fabricante}" required>`);
        if (fabricante == ""){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o fabricante do produto.
                            </div>`);
        }
        resposta.write(` </div>
        <div class="col-12 mb-3">
            <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
            <a class="btn btn-secondary" href="/">Voltar</a>                   
        </div>
    </form>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
crossorigin="anonymous"></script>

</html>`);
        resposta.end();
    }

}
function autenticaUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}
app.post('/login',autenticaUsuario);

app.get('/login',(req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) =>{
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarProduto);

app.get('/listarProdutos', usuarioEstaAutenticado, (req,resp)=>{
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Resultado do cadastro</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Produtos</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Código de Barras</th>');
    resp.write('<th>Descrição do Produto</th>');
    resp.write('<th>Preço de Custo</th>');
    resp.write('<th>Preço de Venda</th>');
    resp.write('<th>Data de Validade</th>');
    resp.write('<th>Quantidade em Estoque</th>');
    resp.write('<th>Nome do Fabricante</th>');
    resp.write('</tr>');
    for (let i=0; i<listaProdutos.length; i++){
        resp.write('<tr>');
        resp.write(`<td>${listaProdutos[i].codigo_barras}`);
        resp.write(`<td>${listaProdutos[i].descricao}`);
        resp.write(`<td>${listaProdutos[i].preco_custo}`);
        resp.write(`<td>${listaProdutos[i].preco_venda}`);
        resp.write(`<td>${listaProdutos[i].data_validade}`);
        resp.write(`<td>${listaProdutos[i].qtd_estoque}`);
        resp.write(`<td>${listaProdutos[i].fabricante}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br/>');

    if(req.cookies.dataUltimoAcesso){
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})