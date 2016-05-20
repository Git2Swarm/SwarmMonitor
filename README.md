#  Swarm Monitor

git clone URL \n  /n

Export your DOCKER SWARM URL before calling "docker-compose up -d" as show below 

export DOCKER_URL=http://DOCKER_SWARM_IP:PORT

export DOCKER_HOST=-H SWARM_MGR_IP:4000

docker-compose ps; rm; build; up 
