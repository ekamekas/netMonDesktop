const{app, BrowserWindow} = require('electron');
const path = require('path')
const url = require('url')

var win;

function createWindow(){
  win = new BrowserWindow({
    width:800, 
    height:800, 
    title:"customPRTGDesktop",
    backgroundColor: '#312450',
    show: false,
    fullscreen:true
  });
  
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/public/', 'welcome.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools();
  win.once("ready-to-show", () => {
    win.show()
  })
  win.on("closed", () => {
    win = null;
  })
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  app.quit();
})
