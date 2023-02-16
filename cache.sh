if [[ -d "$XDG_CACHE_HOME"/public ]]; then
    echo "found cached public dir"
else
    echo "No cached public dir found"
fi

npm install
    
rsync -a "$XDG_CACHE_HOME"/public/images/ public/images
