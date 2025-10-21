// Adiciona um "ouvinte" que espera o HTML estar pronto
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona o formulário pelo ID
    const form = document.getElementById('client-form');

    // Adiciona um "ouvinte" para o evento de 'submit' (clique no botão 'Concluir')
    form.addEventListener('submit', function(event) {
        
        // Impede que o formulário recarregue a página
        event.preventDefault();

        // Pega os valores dos campos de input
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const modelo = document.getElementById('modelo').value;

        // Cria um objeto para o novo cliente
        const novoCliente = {
            nome: nome,
            cpf: cpf,
            modelo: modelo
        };

        // Busca a lista de clientes existente no localStorage
        // Se não existir, começa com uma lista vazia []
        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Adiciona o novo cliente à lista
        clientes.push(novoCliente);

        // Salva a lista ATUALIZADA de volta no localStorage
        localStorage.setItem('clientes', JSON.stringify(clientes));

        // Redireciona o usuário para a página index.html
        window.location.href = 'index.html';
    });
});