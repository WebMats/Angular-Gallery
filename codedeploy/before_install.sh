

export app_root=/usr/ang-gal
if [ -d "$app_root"]; then
    rm -rf /usr/ang-gal
    mkdir -p /usr/ang-gal
else 
    mkdir -p /usr/ang-gal
fi