"""
Virtual Try-On proxy.

Forwards photo try-on requests from the website to the self-hosted CatVTON GPU
server (apps/local-ai/tryon_server.py in the attire project). The browser never
talks to the GPU server: this module holds TRYON_API_KEY and adds it server-side.

No models, so it is not listed in INSTALLED_APPS; it is only mounted in urls.py.
"""
