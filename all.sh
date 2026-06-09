{
  find . -type f \
    ! -path "*/node_modules/*" \
    ! -path "*/.next/*" \
    ! -path "*/.git/*" \
    ! -path "*/fonts/*" \
    ! -path "*/package.json/*" \
    ! -path "*/tsconfig.json/*" \
    ! -path "*/auth_info/*" \
    ! -name "eslint.config.json" \
    ! -name "vite.config.json" \
    ! -name "package-lock.json" \
    ! -name "postcss.config.js" \
    ! -name "*.sh" \
    ! -name "*.env" \
    ! -name "*.bak" \
    ! -name "favicon.ico" \
    ! -name "next.config.js" \
    ! -name "next.config.ts" \
    ! -name "postcss.config.mjs" \
    ! -name "*.png" \
    ! -name "*.svg" \
    ! -name "*.jpg" \
    ! -name "*.psd" \
    ! -name "README.md" \
    ! -name "AGENTS.md" \
    ! -name "ringkasan.txt" \
    ! -name "ecosystem.config.cjs" \
    ! -name "tsconfig.json" \
    ! -name "next-env.d.ts" \
    | sort | while IFS= read -r f; do

      echo "=== $f ==="
      cat "$f"
      echo
    done
} > ringkasan.txt