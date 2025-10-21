document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pega o CPF que foi salvo na sessão
    const cpfCliente = sessionStorage.getItem('cpfClienteParaServico');
    if (!cpfCliente) {
        // Se não achar o CPF, volta para a index
        alert('Erro: Cliente não identificado.');
        window.location.href = 'index.html';
        return;
    }

    // 2. Carrega todos os clientes
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    // 3. Encontra o cliente específico
    const cliente = clientes.find(c => c.cpf === cpfCliente);

    if (!cliente) {
        alert('Erro: Cliente não encontrado.');
        window.location.href = 'index.html';
        return;
    }

    // 4. Seleciona os elementos da página
    const form = document.getElementById('servico-form');
    const infoDiv = document.getElementById('servico-info');
    const titulo = document.getElementById('servico-titulo');
    const subtitulo = document.getElementById('servico-subtitulo');

    // 5. MUDANÇA DE LÓGICA: Verifica se o cliente JÁ TEM um serviço
    if (cliente.servico) {
        // --- SE JÁ TEM SERVIÇO: MODO VISUALIZAÇÃO ---
        
        // Esconde o formulário
        form.style.display = 'none';

        // Preenche o título
        titulo.textContent = 'Detalhes do Serviço';
        subtitulo.textContent = cliente.nome; // Mostra o nome do cliente

        // Formata os dados para exibição
        const valorFormatado = parseFloat(cliente.servico.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const dataFormatada = new Date(cliente.servico.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR');

        // Mostra os dados na Div
        infoDiv.innerHTML = `
            <p><strong>Descrição:</strong><br> ${cliente.servico.descricao}</p>
            <p><strong>Valor:</strong> ${valorFormatado}</p>
            <p><strong>Status:</strong> ${cliente.servico.status}</p>
            <p><strong>Data Prevista:</strong> ${dataFormatada}</p>
            <br>
            <button onclick="window.location.href='index.html'" class="submit-btn">Voltar</button>
        `;
        infoDiv.style.display = 'block'; // Mostra a div

    } else {
        // --- SE NÃO TEM SERVIÇO: MODO CADASTRO ---

        // O formulário já está visível, então só adicionamos o 'submit'
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Pega os dados do formulário
            const novoServico = {
                descricao: document.getElementById('descricao').value,
                valor: document.getElementById('valor').value,
                status: document.getElementById('status').value,
                data_conclusao: document.getElementById('data_conclusao').value,
            };

            // Encontra o ÍNDICE do cliente no array
            const clienteIndex = clientes.findIndex(c => c.cpf === cpfCliente);

            // Adiciona o objeto 'servico' dentro do objeto 'cliente'
            clientes[clienteIndex].servico = novoServico;

            // Salva o array de CLIENTES (agora modificado) de volta
            localStorage.setItem('clientes', JSON.stringify(clientes));

            // Volta para a página inicial
            alert('Serviço salvo com sucesso!');
            window.location.href = 'index.html';
        });
    }
});