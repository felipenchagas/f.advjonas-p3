import os

DOMINIO = "https://advjonasstephani.com.br/pr"

def gerar_lista_formatada(pasta_base=".", saida="lista_por_cidade.txt"):
    total_links = 0
    linhas_saida = []

    for cidade in sorted(os.listdir(pasta_base)):
        caminho_cidade = os.path.join(pasta_base, cidade)
        if os.path.isdir(caminho_cidade):
            linhas_saida.append(f"{cidade.upper()}")
            linhas_saida.append("=" * len(cidade))
            linhas_saida.append("")

            for profissao in sorted(os.listdir(caminho_cidade)):
                caminho_profissao = os.path.join(caminho_cidade, profissao)
                if os.path.isdir(caminho_profissao):
                    linhas_saida.append(f"  ▸ {profissao.capitalize()}")
                    linhas_saida.append("  " + "-" * (len(profissao) + 2))

                    for raiz, _, arquivos in os.walk(caminho_profissao):
                        for nome_arquivo in sorted(arquivos):
                            caminho_relativo = os.path.relpath(os.path.join(raiz, nome_arquivo), pasta_base)
                            # ignora imagens e PDFs
                            if any(p in caminho_relativo.lower() for p in ["/imagens/", "\\imagens\\", ".png", ".jpg", ".jpeg", ".webp", ".pdf"]):
                                continue
                            # formata o link
                            url_relativa = caminho_relativo.replace("\\", "/")
                            if url_relativa.lower().endswith(".html"):
                                url_relativa = url_relativa[:-5]
                            url_completa = f"{DOMINIO}/{url_relativa}"
                            linhas_saida.append(f"     {url_completa}")
                            total_links += 1

                    linhas_saida.append("")  # espaçamento entre profissões

            linhas_saida.append("")  # espaçamento entre cidades
            linhas_saida.append("")

    # adiciona cabeçalho com total
    linhas_saida.insert(0, f"Total de links encontrados: {total_links}")
    linhas_saida.insert(1, "=" * (len(str(total_links)) + 25))
    linhas_saida.insert(2, "")

    with open(saida, "w", encoding="utf-8") as arquivo_saida:
        arquivo_saida.write("\n".join(linhas_saida))

    print(f"✅ Lista formatada gerada: {os.path.abspath(saida)}")
    print(f"🔗 Total de links encontrados: {total_links}")

if __name__ == "__main__":
    gerar_lista_formatada(".")
