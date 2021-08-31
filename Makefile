.PHONY: $(MAKECMDGOALS)
#!make
MAKEFLAGS += --silent

setup:
	npm install
server:
	npm start
test:
	npm run test
