#!/bin/bash
export app_root=/ang-gal
if [ -d "$app_root"]; then
    rm -rf /ang-gal
    mkdir -p /ang-gal
else 
    mkdir -p /ang-gal
fi