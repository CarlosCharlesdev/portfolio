// Tema por horário: manhã (5h–12h), tarde (12h–18h), noite (18h–5h).
// O seletor no topo permite fixar um tema; "auto" volta a seguir o relógio.
// Serve para as duas versões do site (pt-BR e en), pelo atributo lang do <html>.
(function () {
    const root = document.documentElement;
    const en = (root.lang || '').toLowerCase().startsWith('en');
    const botoes = document.querySelectorAll('.theme-switch button');
    const saudacao = document.getElementById('saudacao');
    const legenda = document.getElementById('legenda');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const cores = { manha: '#EAF2F6', tarde: '#EEF1EA', noite: '#1C2233' };
    const textos = en ? {
        manha: { oi: 'Good morning', legenda: 'First coffee of the day: open to freelance projects and job conversations.' },
        tarde: { oi: 'Good afternoon', legenda: 'Afternoon coffee: open to freelance projects and job conversations.' },
        noite: { oi: 'Good evening', legenda: 'Night shift: open to freelance projects and job conversations.' }
    } : {
        manha: { oi: 'Bom dia', legenda: 'Primeiro café do dia: aberto a projetos freelance e conversas sobre vagas.' },
        tarde: { oi: 'Boa tarde', legenda: 'Café da tarde: aberto a projetos freelance e conversas sobre vagas.' },
        noite: { oi: 'Boa noite', legenda: 'Turno da noite: aberto a projetos freelance e conversas sobre vagas.' }
    };

    const periodoAtual = () => {
        const h = new Date().getHours();
        return h >= 5 && h < 12 ? 'manha' : h >= 12 && h < 18 ? 'tarde' : 'noite';
    };
    const lerEscolha = () => {
        try { return localStorage.getItem('tema') || 'auto'; } catch (e) { return 'auto'; }
    };
    const salvarEscolha = (valor) => {
        try { localStorage.setItem('tema', valor); } catch (e) { /* navegação privada */ }
    };

    const aplicar = () => {
        const escolha = lerEscolha();
        const tema = escolha === 'auto' ? periodoAtual() : escolha;
        root.setAttribute('data-theme', tema);
        // A saudação acompanha o tema: no automático segue o relógio, fixado segue a escolha.
        if (saudacao) saudacao.textContent = textos[tema].oi;
        if (legenda) legenda.textContent = textos[tema].legenda;
        if (themeColor) themeColor.setAttribute('content', cores[tema]);
        botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tema === escolha)));
    };

    botoes.forEach((b) => b.addEventListener('click', () => {
        salvarEscolha(b.dataset.tema);
        aplicar();
    }));

    aplicar();
    // Confere o horário a cada minuto: se alguém estiver na página às 18h, ela vira noite sozinha.
    setInterval(aplicar, 60 * 1000);

    const ano = document.getElementById('ano');
    if (ano) ano.textContent = new Date().getFullYear();
})();
