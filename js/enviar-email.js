async function enviarEmail() {
    const nome = $('#name').val();
    const email = $('#email').val();
    const telefone = $('#telefone').val();
    const mensagem = $('#mensagem').val();

    /* Lê o anexo carregado */
    const anexo = document.querySelector('#myfile').files[0];
    const tamanhoMaximoPermitido = 7340032; /* 7mb */
    let dadosAnexo = [];

    if (anexo && (anexo.size > tamanhoMaximoPermitido)) {
        $('#tamanhoMaximoExcedidoModal').modal('toggle');
        return;
    } else {
        dadosAnexo = await prepararAnexo(anexo);
    }

    /* Desabilita o botão */
    $('#enviar').attr('disabled', 'true');

    /* Mostra o loading */
    $('#loading-spinner').removeAttr('hidden');

    Email.send({
        SecureToken : "75741024-feaf-48a9-b4f9-c8fff199dd39",
        To : 'foodpaperpt@gmail.com',
        From : 'orcamentos.foodpaperportugal@gmail.com',
        Subject : `Pedido de Orçamento - ${email}`, /* Assunto */
        Body : montarMensagem(nome, email, telefone, mensagem), /* Corpo do email */
        Attachments: dadosAnexo /* Anexo */
    }).then(() => { /* Após o envio do email */
        /* Mostra o modal */
        $('#messageSent').modal('toggle');

        /* Oculta o loading */
        $('#loading-spinner').attr('hidden', 'true');

        /* Habilita o botão */
        $('#enviar').removeAttr('disabled');

        limparFormulario();
    });
}

/**
 * HTML que será renderizado no corpo do email.
 * */
function montarMensagem(nome, email, telefone, detalhes) {
    return `<div>
                <p><strong>Novo pedido de orçamento:</strong></p>
                <p>Cliente: ${nome}</p>
                <p>Email: ${email}</p>
                <p>Telefone: ${telefone}</p>
                <p>Detalhes: ${detalhes}</p>
            </div>`;
}

/**
 * Lê o ficheiro carregado para upload.
 * */
const prepararAnexo = anexo => new Promise((resolve, reject) => {

    /* Se não houver anexo, não processo o ficheiro */
    if (!anexo) {
        resolve([]);
    } else {
        const reader = new FileReader();
        reader.readAsDataURL(anexo);
        reader.onload = () => resolve([{name: anexo.name, data: reader.result}]);
        reader.onerror = error => reject(error);
    }
});

function limparFormulario() {
    $('#name').val("")
    $('#email').val("");
    $('#telefone').val("");
    $('#mensagem').val("");
    document.querySelector('#myfile').value = null;
}