"""Assemble independent section files into a dependency-free static page."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ORDER = ['home', 'about', 'research', 'experience', 'academics', 'achievements', 'games', 'contact']
template = (ROOT / 'template.html').read_text(encoding='utf-8')
sections = '\n'.join((ROOT / 'sections' / f'{name}.html').read_text(encoding='utf-8') for name in ORDER)
(ROOT / 'index.html').write_text(template.replace('<!-- SECTIONS -->', sections), encoding='utf-8')
print('Built index.html from eight section files.')
