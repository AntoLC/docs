# System Requirements

This document outlines the minimum and recommended system requirements for running La Suite Docs in both development and production environments.

## Overview

La Suite Docs is a comprehensive collaborative text editing platform that consists of multiple containerized services. The application architecture includes several components that require significant system resources to operate efficiently.

## Architecture Components

The application consists of the following main services:

- **Backend (Django)**: Main application server with API endpoints
- **Frontend (Next.js)**: React-based user interface
- **Y-Provider**: Real-time collaboration service using Yjs
- **PostgreSQL**: Primary database (2 instances: main + Keycloak)
- **Redis**: Caching and session storage
- **Celery**: Background task processing
- **Keycloak**: Identity and access management
- **MinIO**: S3-compatible object storage
- **Nginx**: Reverse proxy and load balancer
- **MailCatcher**: Email testing (development only)

## Minimum System Requirements

### Hardware Requirements

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| **RAM** | **16 GB** | **32 GB** | Critical for running all containers simultaneously |
| **CPU** | 4 cores | 8+ cores | Multi-core recommended for containerized workloads |
| **Storage** | 20 GB | 50+ GB | Includes Docker images, database, and media files |
| **Network** | 1 Gbps | 1 Gbps+ | For efficient container communication |

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Docker** | 20.10+ | Container runtime |
| **Docker Compose** | 2.0+ | Multi-container orchestration |
| **Git** | 2.30+ | Source code management |

#### Development Environment Additional Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **GNU Make** | 3.8+ | Build automation |
| **Node.js** | 22+ | Frontend development |
| **Python** | 3.13+ | Backend development |
| **Yarn** | 1.22+ | Package management |

#### Kubernetes Deployment Additional Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Kind** | 0.17+ | Local Kubernetes testing |
| **Helm** | 3.10+ | Kubernetes package manager |
| **Kubectl** | 1.25+ | Kubernetes CLI |
| **Mkcert** | 1.4+ | Local SSL certificates |

## Performance Considerations

### Memory Usage Breakdown

The application's memory footprint is distributed across multiple containers:

- **PostgreSQL (2 instances)**: ~2-4 GB
- **Django Backend + Celery**: ~2-3 GB
- **Frontend (Next.js)**: ~1-2 GB
- **Y-Provider (Yjs)**: ~1 GB
- **Keycloak**: ~1-2 GB
- **Redis**: ~500 MB
- **MinIO**: ~500 MB
- **Nginx**: ~100 MB
- **System overhead**: ~2-4 GB

**Total estimated usage**: 10-16 GB under normal load

### Why 32 GB RAM is Recommended

- **Development hot-reloading**: Additional memory for file watching and compilation
- **Multiple environments**: Running tests, development, and production simultaneously
- **Database caching**: PostgreSQL and Redis benefit from additional memory
- **Build processes**: Docker image builds require temporary additional memory
- **IDE and development tools**: Additional overhead for development environment
- **OS and system processes**: Baseline system requirements

## Storage Requirements

### Disk Space Breakdown

| Component | Space Recommended | Notes |
|-----------|----------------|-------|
| Docker images | 5-8 GB | All service images |
| Database data | 2-5 GB | Grows with usage |
| Media files | Variable | User-uploaded content |
| Logs | 1-2 GB | Application and container logs |
| Build cache | 3-5 GB | Docker layer cache for faster builds |

### Recommended Storage Configuration

- **SSD storage**: Recommended for database and container performance
- **Separate volumes**: Consider separate volumes for data persistence
- **Backup space**: Additional space for database and media backups

## Network Requirements

### Port Usage

The application uses the following ports in development:

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Frontend | Next.js development server |
| 8071 | Backend | Django development server |
| 8080 | Keycloak | Identity management |
| 8083 | Nginx | Reverse proxy |
| 4444 | Y-Provider | Real-time collaboration |
| 9000/9001 | MinIO | Object storage |
| 15432 | PostgreSQL | Main database |
| 5433 | PostgreSQL | Keycloak database |
| 1081 | MailCatcher | Email testing |

### Firewall Configuration

For production deployment, ensure the following ports are properly configured:
- **80/443**: HTTP/HTTPS traffic
- **Internal networking**: Allow container-to-container communication
- **Database ports**: Restrict access to trusted sources only

## Operating System Compatibility

### Supported Operating Systems

| OS | Version | Notes |
|----|---------|-------|
| **Linux** | Ubuntu 20.04+, CentOS 8+, Debian 11+ | Recommended for production |
| **macOS** | 11.0+ (Big Sur) | Development environment |
| **Windows** | 10/11 with WSL2 | Development environment |

### Container Runtime

- **Docker Desktop**: Recommended for development on macOS/Windows
- **Docker Engine**: Recommended for Linux production environments
- **Resource allocation**: Configure Docker with adequate memory and CPU limits

## Performance Optimization Tips

### Docker Configuration

```bash
# Recommended Docker Desktop settings
Memory: 8-16 GB
CPUs: 4-8 cores
Swap: 2 GB
Disk image size: 50+ GB
```

### System Optimization

1. **Increase file watchers** (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Optimize Docker daemon** (`/etc/docker/daemon.json`):
   ```json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

3. **Use Docker BuildKit** for faster builds:
   ```bash
   export DOCKER_BUILDKIT=1
   ```

## Production Considerations

### Scaling Requirements

For production environments with multiple users:

- **Memory**: Scale linearly with concurrent users (1-2 GB per 100 concurrent users)
- **CPU**: Consider auto-scaling based on load
- **Database**: Separate database server with adequate IOPS
- **Storage**: High-performance storage for database and shared media

### Monitoring

Implement monitoring for:
- Container resource usage
- Database performance
- Memory utilization
- Disk I/O and space
- Network throughput

## Troubleshooting Common Issues

### Out of Memory Errors

- Increase Docker memory allocation
- Check for memory leaks in application logs
- Consider reducing the number of concurrent services

### Slow Performance

- Verify adequate RAM allocation
- Check disk I/O performance
- Monitor network latency between containers
- Review Docker resource limits

### Build Failures

- Ensure adequate disk space for Docker builds
- Increase Docker memory allocation
- Clear Docker build cache if needed

## Getting Help

If you encounter resource-related issues:

1. Check the [troubleshooting documentation](./troubleshoot.md)
2. Monitor system resources during operation
3. Review Docker and application logs
4. Consider adjusting resource allocation based on usage patterns

For more information about installation and deployment, see:
- [Installation Guide](./installation.md)
- [Environment Variables](./env.md)
- [Architecture Overview](./architecture.md)
