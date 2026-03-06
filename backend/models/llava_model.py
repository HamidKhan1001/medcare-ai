# backend/models/llava_model.py
# ═══════════════════════════════════════
# MedCare AI — LLaVA Model Loader
# Syed Hassan Tayyab — Atomcamp 2026
# ═══════════════════════════════════════

import torch
import logging
from transformers import (
    LlavaNextProcessor,
    LlavaNextForConditionalGeneration,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_processor = None
_model = None

def get_model():
    global _processor, _model

    if _processor is None or _model is None:
        logger.info("Loading LLaVA-Med...")

        _processor = LlavaNextProcessor\
            .from_pretrained(
            "llava-hf/llava-v1.6-mistral-7b-hf",
            use_fast=False
        )

        _model = LlavaNextForConditionalGeneration\
            .from_pretrained(
            "llava-hf/llava-v1.6-mistral-7b-hf",
            torch_dtype=torch.float16,
            device_map="auto",
            low_cpu_mem_usage=True,
        )
        _model.eval()
        logger.info("✅ LLaVA-Med loaded!")

    return _processor, _model

def get_device():
    return "cuda" if torch.cuda\
        .is_available() else "cpu"