# Quick Guide: Make Repository Public

## Tomorrow Night - Before Submission

Run this single command to make the repository public:

```bash
gh repo edit --visibility public
```

Or use the GitHub web interface:
1. Go to: https://github.com/JustinMurray007/pgm-bornless-ritual/settings
2. Scroll to bottom → "Danger Zone"
3. Click "Change visibility"
4. Select "Make public"
5. Type the repository name to confirm

## Verify After Making Public

1. **License is visible**: Check the "About" section shows "MIT License"
2. **README displays correctly**: Verify the license badge shows
3. **`.kiro/` directory is visible**: Browse to https://github.com/JustinMurray007/pgm-bornless-ritual/tree/master/.kiro

## Submit This URL

```
https://github.com/JustinMurray007/pgm-bornless-ritual
```

## Optional: Add Live Demo

If you deploy to Vercel:
```bash
vercel --prod
```

Then add the live URL to:
- Repository description (Settings → About)
- README.md (add a "Live Demo" link at the top)

---

**That's it!** The repository is already fully prepared for submission. Just make it public when ready.
