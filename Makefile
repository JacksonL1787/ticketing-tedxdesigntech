dockerbuild:
	docker build -t ticketing-tool:latest .

dockerrun:
	docker run -d -p 3000:3000 -p 27017:27017 -v :.:/app --env-file .env ticketing-tool