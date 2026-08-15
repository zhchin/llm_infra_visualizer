# LLM Inference & Token Economics Simulator

A first-principles, interactive playground and telemetry dashboard designed for LLM infrastructure engineers, developers, and researchers. This visualizer models hardware execution boundaries, memory wall paradoxes, network communication bottlenecks, and the multi-tier storage economics of serving Large Language Models (both Dense and Mixture of Experts architectures).

**Live Demo Website:** [https://zhchin.github.io/llm_infra_visualizer/](https://zhchin.github.io/llm_infra_visualizer/)

This is mainly an educational and intuition-building tool, not a production-grade performance simulator.

![LLM Infra Visualizer Screenshot](./images/screenshot.png)


## Key Features

### 1. Interactive Roofline Model
- **Bottleneck Visualization**: Interactively charts execution limits. Instantly see when your serving environment transitions from **Memory-bandwidth bound** (low batch size decoding) to **Compute-bound** (high batch size prefill or heavy batch processing).
- **The Memory Wall Paradox**: Simulates why prefill (TTFT) is mathematically compute-bound at prompt lengths $L > 300$ tokens, whereas decoding is bound by memory bandwidth.

### 2. Multi-GPU Cluster Topology & Sharding Telemetry
- **Hardware Presets**: Models industry-standard silicon targets including Nvidia Blackwell, Hopper H100, Ampere A100, and Google TPU.
- **Dynamic Sharding**: Simulates Tensor Parallelism (TP-1, TP-2, TP-4, TP-8) requirements. Automatically calculates required sharding cluster configurations based on parameter size and KV Cache footprints against raw GPU HBM capacity limits.
- **Dense vs. MoE Visualizer**: 
  - **Dense Models** ($P_{\text{active}} == P_{\text{total}}$) trigger a synchronized cyan heartbeat pulsing animation across simulated GPUs.
  - **MoE Models** ($P_{\text{active}} < P_{\text{total}}$) trigger a staggered, asynchronous purple wave animation, representing expert routing and rack-scale collective communication overheads.

### 3. KV Cache Storage Economics
- **Interactive Multi-Tier Analysis**: Calculates the holding cost and retrieval penalties of keeping KV Caches across various memory tiers:
  - **GPU HBM** (Premium low-latency rent)
  - **Host DDR RAM** (PCIe-bound offload)
  - **NVMe SSD** (Cold-storage offload)
  - **Rematerialization / Recomputation** (Trading compute overhead to free up memory bandwidth)
- Helps model the break-even points of context retention times ($T_{\text{hold}}$) under real-world cloud server rental prices.

### 4. Agentic Chatbot Helper ("Little Z")
- **Expert Assistant**: Built-in streaming conversational interface.
- **Reverse Control Engine**: "Little Z" is equipped with system instructions to output JSON controls. It can autonomously adjust the dashboard's sliders (e.g. Batch Size, Context Length, KV Cache size) in real-time response to your prompts.
- **API Configuration Required**: Since this is a client-side application without a pre-configured backend, you must input your own LLM API Endpoint, API Key, and Model name (via the gear settings icon in the top right corner of the chat panel) to enable the chatbot functionality. It supports any OpenAI-compatible APIs (e.g., OpenAI, DeepSeek, Anthropic, or local Ollama).

---

## The Mathematics Behind The Telemetry

### Decode Step Latency
$$t_{\text{step}} = \max(t_{\text{compute}}, t_{\text{mem}})$$

- **Compute Bound Latency**:
  $$t_{\text{compute}} = \frac{2 \cdot B \cdot P_{\text{active}}}{F}$$
- **Memory Bandwidth Bound Latency**:
  $$t_{\text{mem}} = \frac{P_{\text{total}} \cdot \text{precision} + B \cdot L \cdot \text{kvToken}}{\text{bandwidth}}$$

Where:
- $B$: Batch Size
- $L$: Context Length (Tokens)
- $P_{\text{active}}$ / $P_{\text{total}}$: Active / Total Parameters
- $F$: FPflops / cluster
- $\text{kvToken}$: KV Cache bytes per Token
- $\text{bandwidth}$: Total HBM bandwidth of the cluster

---

## Quick Start

This project is a standalone, client-side web application built with **Vanilla HTML5, CSS3, and JavaScript**. 

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/llm-token-economics.git
   cd llm-token-economics
   ```
2. **Launch**:
   Simply open `index.html` directly in your web browser (Chrome, Edge, or Firefox). No installation, build process, or server configuration is required.
   
3. **Toggle Languages**:
   Use the language selector button in the top-right corner to toggle between English and Traditional Chinese.

## Dependencies

All visualization and rendering dependencies are loaded via CDNs:
- **Chart.js**: High-performance interactive charts.
- **KaTeX**: Fast mathematical formula rendering.

## License

This project is open-source and licensed under the MIT License.
