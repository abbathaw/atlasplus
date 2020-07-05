const videoMacro = (req, res) => {
  res.render("macro/video-macro", { macroId: req.query.macroId })
}

const videoMacroEditor = (req, res) => {
  res.render("macro/video-macro-editor")
}

export { videoMacro, videoMacroEditor }
