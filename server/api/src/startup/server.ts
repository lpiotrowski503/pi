class Server {
  port

  server(app) {
    this.port = process.env.PORT || 3000
    app.listen(this.port, () => {
      console.log(`server running on port ${this.port}`)
    })
  }
}

export default new Server().server
