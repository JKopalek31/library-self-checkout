import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const { useHistory } = require('react-router-dom'); // Import useHistory from React Router


// Custom APIs for renderer
const api = {

  navigateToNewPage: () => {
    // Use useHistory to navigate to a new page
    const history = useHistory();
    history.push('/new-page');
  },


}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
