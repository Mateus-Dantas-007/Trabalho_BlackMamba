document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Pega o CPF e o MODO da sessão
    const cpfCliente = sessionStorage.getItem('cpfClienteParaServico');
    const modo = sessionStorage.getItem('modoServico');
    
    // 2. Limpa a flag de modo para não afetar a próxima visita
    sessionStorage.removeItem('modoServico');

    if (!cpfCliente) {
        alert('Erro: Cliente não identificado.');
        window.location.href = 'index.html';
        return;
    }

    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(c => c.cpf === cpfCliente);

    if (!cliente) {
        alert('Erro: Cliente não encontrado.');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('servico-form');
    const infoDiv = document.getElementById('servico-info');
    const titulo = document.getElementById('servico-titulo');
    const subtitulo = document.getElementById('servico-subtitulo');

    // 3. NOVA LÓGICA PRINCIPAL
    
    // CASO 1: Cliente tem serviço E NÃO estamos em modo de edição (MODO VISUALIZAÇÃO)
    if (cliente.servico && modo !== 'editar') {
        
        form.style.display = 'none';
        titulo.textContent = 'Detalhes do Serviço';
        subtitulo.textContent = cliente.nome; 

        const valorFormatado = parseFloat(cliente.servico.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const dataFormatada = new Date(cliente.servico.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR');

        infoDiv.innerHTML = `
            <p><strong>Descrição:</strong><br> ${cliente.servico.descricao}</p>
            <p><strong>Valor:</strong> ${valorFormatado}</p>
            <p><strong>Status:</strong> ${cliente.servico.status}</p>
            <p><strong>Data Prevista:</strong> ${dataFormatada}</p>
            <br>
            <button onclick="window.location.href='index.html'" class="submit-btn">Voltar</button>
        `;
        infoDiv.style.display = 'block'; 

    } else {
        // CASO 2: Cliente NÃO tem serviço OU estamos em modo de edição (MODO FORMULÁRIO)
        
        infoDiv.style.display = 'none'; // Garante que a div de infos está escondida
        form.style.display = 'block'; // Garante que o form está visível

        // Se for modo de edição, preenche o formulário com dados existentes
        if (cliente.servico && modo === 'editar') {
            titulo.textContent = 'Editar Serviço';
            subtitulo.textContent = cliente.nome;
            form.querySelector('.submit-btn').textContent = 'Atualizar Serviço';
            
            // Preenche os campos
            document.getElementById('descricao').value = cliente.servico.descricao;
            document.getElementById('valor').value = cliente.servico.valor;
            document.getElementById('status').value = cliente.servico.status;
            document.getElementById('data_conclusao').value = cliente.servico.data_conclusao;

        } else {
            // Modo "Adicionar Novo"
            titulo.textContent = 'Adicionar Serviço';
            subtitulo.textContent = cliente.nome;
            // O botão já diz "Salvar Serviço" por padrão
        }

        // A lógica de SALVAR é a mesma para ADICIONAR e EDITAR
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const novoServico = {
                descricao: document.getElementById('descricao').value,
                valor: document.getElementById('valor').value,
                status: document.getElementById('status').value,
                data_conclusao: document.getElementById('data_conclusao').value,
            };

            const clienteIndex = clientes.findIndex(c => c.cpf === cpfCliente);

            // Isso aqui sobrescreve o serviço antigo ou cria um novo
            clientes[clienteIndex].servico = novoServico; 

            localStorage.setItem('clientes', JSON.stringify(clientes));

            alert('Serviço salvo com sucesso!');
            window.location.href = 'index.html';
        });
    }
});