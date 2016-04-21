help:
	@echo "dist -- create distribution files"

node_modules:
	npm install

serve:
	node_modules/.bin/vegetables serve

dist: node_modules
	# mermaid
	rsync node_modules/mermaid/dist/mermaid.min.js template/assets/js/
	rsync node_modules/mermaid/dist/mermaid.css template/assets/css/
	# MathJax
	rsync node_modules/mathjax/MathJax.js template/assets/mathjax/
	rsync -r node_modules/mathjax/fonts template/assets/mathjax/
	rsync -r node_modules/mathjax/jax template/assets/mathjax/
	rsync -r node_modules/mathjax/config template/assets/mathjax/
	rsync -r node_modules/mathjax/extensions template/assets/mathjax/
