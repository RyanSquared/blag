.PHONY: build install

build:
	yarn install
	poetry build

install: build
	find dist -name '*whl' -exec pip3 install --user {} \;
