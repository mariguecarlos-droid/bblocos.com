import re
import os

def analyze_images(html_content, base_path):
    img_tags = re.findall(r'<img\s+([^>]*?)src="([^"]+)"([^>]*?)>', html_content, re.IGNORECASE)
    
    image_data = []
    
    for full_match, src, after_src in img_tags:
        alt_match = re.search(r'alt="([^"]*)"', full_match + after_src, re.IGNORECASE)
        alt_text = alt_match.group(1) if alt_match else ""

        width_match = re.search(r'width="([^"]*)"', full_match + after_src, re.IGNORECASE)
        height_match = re.search(r'height="([^"]*)"', full_match + after_src, re.IGNORECASE)
        
        width = width_match.group(1) if width_match else None
        height = height_match.group(1) if height_match else None

        # Resolve absolute path for image file to check existence and size
        abs_src = os.path.join(base_path, src)
        file_exists = os.path.exists(abs_src)
        file_size_kb = os.path.getsize(abs_src) / 1024 if file_exists else 0
        
        image_data.append({
            'src': src,
            'alt': alt_text,
            'width': width,
            'height': height,
            'file_exists': file_exists,
            'file_size_kb': round(file_size_kb, 2)
        })
    return image_data

# Read index.html content
with open('index.html', 'r') as f:
    index_html_content = f.read()

# Base path for image files
base_path = os.getcwd() # Current working directory

images_info = analyze_images(index_html_content, base_path)

print("Análise de Imagens no index.html:")
for img in images_info:
    print(f"  Src: {img['src']}")
    print(f"    Alt: '{img['alt']}' {'(Sugestão: Tornar mais descritivo)' if not img['alt'] or img['alt'] == 'logo' or img['alt'] == 'Descrição da imagem' else ''}")
    print(f"    Width: {img['width'] if img['width'] else 'Faltando!'}")
    print(f"    Height: {img['height'] if img['height'] else 'Faltando!'}")
    print(f"    Tamanho do arquivo: {img['file_size_kb']} KB")
    print(f"    Arquivo existe: {'Sim' if img['file_exists'] else 'Não!'}")
    print("-" * 30)
