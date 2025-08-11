import { reactive } from 'vue'
import dayjs from 'dayjs'

export function useCvModel(){
  const model = reactive({
    photo: '',
    signature: '',
    identity: {
      name: 'Rami Aouinti',
      headline: 'Backend Developer',
      birth: '25.08.1989 in Tunis'
    },
    contact: {
      address: 'Widdersdorfer Landstr. 11',
      city: '50859 Köln',
      phone: '0176/17635587613',
      email: 'rami.aouinti@gmail.com'
    },
    experience: [
      { id:'e1', period:'Seit 11/2016', company:'Dritte Station GmbH', role:'Senior Projektmanager', bullets:[ 'Erfolgreiche Leitung mehrerer Projekte' ] },
      { id:'e2', period:'05/2014 - 10/2016', company:'Zweite GmbH & Co. KG', role:'Projektmanager', bullets:[ 'Mehrere Projekte als Teil eines Projektteams erfolgreich ...' ] },
      { id:'e3', period:'01/2012 - 02/2014', company:'Erste Beispiel GmbH', role:'Junior Projektmanager', bullets:[ 'Einblicke in diesen Bereichen gesammelt' ] },
    ],
    education: [
      { id:'d1', period:'10/2007 - 10/2011', school:'Universität Musterstadt', degree:'BWL-Studium', bullets:['Schwerpunkte: Marketing und Management','Auslandssemester in London'] },
      { id:'d2', period:'10/2011 - 10/2013', school:'Universität Musterstadt', degree:'DE-Studium', bullets:['Schwerpunkte: Telekommunikation und Informationstechnick','Auslandssemester in Berlin'] },
    ],
    skills: [
      { id:'s1', label:'Frontend', items:['Vue 3','TypeScript','Pinia'] },
      { id:'s2', label:'Backend', items:['Node.js','Express','PostgreSQL'] },
    ],
    languages: [
      { id:'de', name:'Deutsch',  level:5, note:'Muttersprache' },
      { id:'en', name:'English',  level:4, note:'fließend' },
      { id:'fr', name:'Français', level:3 },
    ],
    interests: ['Lesen', 'Sport (Fußball, Jogging)'],
    personal: [
      { id:'name',    icon:'mdi-account',       label:'Name',       value:'Rami Aouinti' },
      { id:'phone',   icon:'mdi-phone',         label:'Telefon',    value:'0176/17635587613' },
      { id:'email',   icon:'mdi-email',         label:'E-Mail',     value:'rami.aouinti@gmail.com' },
      { id:'birth',   icon:'mdi-cake-variant',  label:'Geburtstag', value:'25.08.1989 in Tunis' },
      { id:'address', icon:'mdi-map-marker',    label:'Adresse',    value:'50859 Köln' },
    ],
  })

  function setByPath(obj:any, path:string, value:any){
    const segs = path.split('.')
    let cur = obj
    for(let i=0;i<segs.length-1;i++) cur = cur[segs[i]]
    cur[segs[segs.length-1]] = value
  }

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject)=>{
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return { model, setByPath, readFile }
}
