# Web design & development specialization toolkit

Reproducible Claude Code setup: 9 original skills (`skills/`), 102 pinned third-party skills (`manifest.json`, `MANIFEST.md`), global instructions (`CLAUDE.md.snippet`).

    bash web-specialization/install.sh      # idempotent; never overwrites existing skills; appends one marked block to ~/.claude/CLAUDE.md

Entry point for every website task: skill `web-specialization-router`.
Third-party content is fetched at pinned commits; scripts that call paid third-party APIs (scroll-craft `kie.mjs`) are excluded.
