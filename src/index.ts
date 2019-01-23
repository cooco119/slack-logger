import * as fs from 'fs';
import * as fetch from 'node-fetch';

class slackLogger {
  public static apiUrl: string = "";
  public static logfilePath: string = "";
  public static backend: string = "";
  public static levels: Array<string> = null;
  public static lastModifiedLine: number = 0;

  public static main(): number {
    // Read config file & setup starting position
    let data = fs.readFileSync('./logger.config.1.json');
    let jsonData = JSON.parse(data.toString());
    this.apiUrl = jsonData.url;
    this.logfilePath = jsonData.logfilePath;
    this.backend = jsonData.backend;
    this.levels = jsonData.levels;

    console.log('API url: ' + this.apiUrl);
    console.log('logfilePath: ' + this.logfilePath);
    console.log('backend: ' + this.backend);
    console.log('levels: '); console.log(this.levels);

    // Set lastModifiedLine to current number of lines in logfile
    fs.createReadStream(this.logfilePath)
      .on('error', e => console.error(e))
      .on('data', (chunk: Buffer) => {
        for (let i:number = 0; i < chunk.length; ++i){
          if (chunk[i] == 10) this.lastModifiedLine++;
        }
      })
      .on('end', () => {
        console.log('Current lines: ' + this.lastModifiedLine.toString());
      })

    // Start watching logfile
    fs.watch(this.logfilePath, async (event, filename) => {
      if (event === 'change'){
        await this.logChangeCallback(event, filename, this.logfilePath, this.lastModifiedLine, this.apiUrl, this.levels);
        console.log("Looking at line " + this.lastModifiedLine.toString());
      }
      return;
    })

    return 0;
  }

  public static async logChangeCallback(event: string, filename: string, logfilePath: string, lastModifiedLine: number, url: string, levels: Array<string>){
    /*
    When gets event 'change', check if the level of new log is in 'levels'.

    <First version: django, check 'ERROR' & 'DEBUG'>
    If 'ERROR', emit to slack api.
    If 'DEBUG', emit to slack api. 
    */
    let startLine: number = lastModifiedLine;
    let endLine: number = startLine;
    let content: Array<string>;
    let msgs: Array<string> = [];
    if (event === 'change'){      
      content = fs.readFileSync(logfilePath).toString().split('\n');
      for (let i:number = startLine; i < content.length; i++){
        endLine++;
        let msg = content[i];
        if (levels.indexOf(msg.split(' ')[0]) > -1){
          msgs.push(content[i]);
        }
      }

      for (let i: number = 0; i < msgs.length; i++){
        let data = {
          'text': msgs[i]
        }
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (response.status === 200){
          // console.log('Message sent!');
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 10000))
    fs.watch(this.logfilePath, async (event, filename) => {
      if (event === 'change'){
        this.lastModifiedLine = endLine - 1;
        await this.logChangeCallback(event, filename, this.logfilePath, this.lastModifiedLine, this.apiUrl, this.levels);
        // console.log("Looking at line " + this.lastModifiedLine.toString());
      }
      return;
    })

    return 
  }
}

slackLogger.main();