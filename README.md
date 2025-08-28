# Java Spring Boot Microservices Project

Bu proje, Udemy’deki “Java Spring Boot Microservices with Spring Cloud, Kubernetes & Docker” kursu esas alınarak geliştirilmiştir. Kurs boyunca adım adım inşa edilen mikroservis mimarisi bu repo kapsamında uygulanmaktadır.

##  İçindekiler

- [Hakkında](#hakkında)  
- [Öğrenilecekler (What You'll Learn)](#öğrenilecekler)  
- [Önkoşullar (Prerequisites)](#önkoşullar)  
- [Kurulum ve Çalıştırma (Installation & Running)](#kurulum-ve-çalıştırma)  
- [Mimari Bileşenler (Architecture Components)](#mimari-bileşenler)  
- [Kullanım (Usage)](#kullanım)  
- [Testler (Testing)](#testler)  
- [CI/CD ve Dağıtım (CI/CD & Deployment)](#ci–cd-ve-dağıtım)  
- [Teknolojiler (Technologies)](#teknolojiler)  
- [Katkıda Bulunma (Contributing)](#katkıda-bulunma)  
- [Lisans (License)](#lisans)

---

## Hakkında

Bu proje, kurs kapsamında inşa edilen mikroservis tabanlı bir sistemdir. Her bir bileşen (config-server, eureka-discovery, gateway, user-service, order-service vb.) bağımsız şekilde çalıştırılabilir ve Docker ile Kubernetes ortamlarına taşınabilir.

---

## Öğrenilecekler (What You’ll Learn)

- Mikroservis mimarisi ile monolitik mimarinin farkları ve avantajları  
- Spring Boot & Spring Cloud ile üretim kalitesinde servisler geliştirme  
- Spring Cloud Config Server ile merkezi konfigürasyon yönetimi  
- Spring Eureka ile servis keşif ve kayıt (service discovery)  
- Spring Cloud Gateway ile API yönlendirme (routing)  
- Resilience4j ile servis dayanıklılığı (circuit breaker, fallback)  
- Distributed tracing ve log toplama (Spring Sleuth ve Zipkin)  
- Docker & Kubernetes kullanarak containerizasyon ve orkestrasyon  
- OAuth2 & Okta ile mikroservis güvenliği  
- CI/CD pipeline ile GCP üzerinde otomatik deploy sistemi  
- Birim testler (unit tests) ile kod kalitesini garanti altına alma  
:contentReference[oaicite:0]{index=0}

---

## Önkoşullar (Prerequisites)

- Java 11+  
- Maven veya Gradle  
- Docker Desktop yüklü ve erişilebilir  
- Kubernetes kümesi (Minikube, Docker Desktop Kubernetes veya GKE)  
- Okta hesabı (security modülü için)  
- GCP hesabı (opsiyonel CI/CD ve deploy için)

---

## Kurulum ve Çalıştırma (Installation & Running)

1. Projeyi klonla:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
