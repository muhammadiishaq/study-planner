# Day 30 – Docker Images and working with Container Lifecycle........

## Task 1: Working with Docker Images

### 1. Pull Below images..

To begin, I downloaded three official images from Docker Hub: nginx, ubuntu, and alpine.
```
docker pull nginx
docker pull ubuntu
docker pull alpine
```
This command fetches the latest available version of each image and stores it locally.

### 2. List Local Images and Observe Sizes...

```
docker images
```
### This displays:
Repository name

Tag

Image ID

Creation time

Image size

---

### 3. Ubuntu vs Alpine – Why the Big Size Difference..?

Ubuntu is a full-featured, Debian-based Linux distribution that comes with GNU utilities, standard libraries, and many preinstalled tools. It provides a complete environment out of the box, but it has a larger image size and consumes more disk space and system resources.

Alpine is a minimal Linux distribution designed for simplicity and security. It uses musl instead of glibc and has a very small footprint. Alpine is ideal for lightweight, optimized containers, especially in microservices environments.


### 4. Inspecting an Image
```
docker inspect nginx
```
This provides detailed JSON metadata including:
It helps understand how the image is structured internally.

- Image ID

- Tags

- Creation timestamp

- Default configuration

   - Exposed ports

   - Environment variables

   - Entrypoint

   - Default CMD

- OS type

- Architecture

- Storage driver

- Layer information

### 5. Removing an Unused Image

To delete an image that is no longer needed:

```
docker rmi <image-id>
```

---

## Task 2: Understanding Image Layers

1. Run `docker image history nginx` — what do you see?
2. Each line is a **layer**. Note how some layers show sizes and some show 0B
3. Write in your notes: What are layers and why does Docker use them?

**Answer...**

Docker images are built in layers. Every time you make a change to the file system, a new layer is created. In a Dockerfile, each instruction like FROM, COPY, RUN, or CMD creates a separate layer.

These layers are important because Docker saves (caches) them after building the image. When you build the image again, Docker reuses the layers that have not changed. This makes the build process faster and more efficient.

---

## Task 3: Container Lifecycle
Practice the full lifecycle on one container:
1. **Create** a container (without starting it)
2. **Start** the container
3. **Pause** it and check status
4. **Unpause** it
5. **Stop** it
6. **Restart** it
7. **Kill** it
8. **Remove** it

Check Below screenshot each step mentions — observe the state changes.

   ![snapshot](images/state.png)
    
   ![snapshot](images/state1.png)
    
---

## Task 4: Working with Running Containers

**1. Run an Nginx container in detached mode**
```
docker run -d -p 80:80 nginx
```
   ![snapshot](images/4-a.png)
    
**2. View its logs**
```
docker logs <container name or ID> 
```
   ![snapshot](images/4-b.png)
    
**3. View real-time logs (follow mode)**
```
docker logs -f <container name>
```

   ![snapshot](images/4-c.png)
    
**4. Exec into the container and look around the filesystem**
```
docker exec -it <container name> <give shell name like bash sh >
```
   ![snapshot](images/4-d.png)
    
**5. Run a single command inside the container without entering it**
```
docker exec -it < container name > ls
```
   ![snapshot](images/4-e.png)
    
**6. Inspect the container — find its IP address, port mappings, and mounts**
```
docker inspect <container-name>
```
This command shows detailed information about the container in JSON format. From the output, you can find the internal container IP address, port bindings (how container ports are mapped to host ports), volume mounts, and network configuration. It helps you understand how the container is set up and connected.

   ![snapshot](images/4-fip.png)
   ![snapshot](images/4-fport.png)
   ![snapshot](images/4-fmount.png)

---

### Task 5: Cleanup
1. Stop all running containers in one command
```
docker stop $(docker ps -q)
```
    ![snapshot](images/stop-all.png)
    
2. Remove all stopped containers in one command
```
docker rm $(docker ps -aq)
```
    ![snapshot](images/rm-all.png)
    
* Also using prune
```
docker system prune
```    
   ![snapshot](images/prune.png)
    
3. Deleted dangling and unused images:
```

```

   ![snapshot](images/rm-images.png)
    
4. To check Docker disk usage, use:
```
docker system df
```
This command shows how much storage Docker is using. It displays the space used by images, containers, volumes, and the build cache. It helps you understand where your disk space is being used and manage it better.

 ![snapshot](images/df.png)
    
---







