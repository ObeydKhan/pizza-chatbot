

const decpl=4  // Dec places of minutes output
//**************CD****************
function ComputeFormCD(){
    //get select  values
var signlat1,signlat2,signlon1,signlon2,dc
var lat1,lat2,lon1,lon2
var d,crs12,crs21
var argacos
var a,invf
  /* Input and validate data */
signlat1=signlatlon(document.InputFormCD.NS1)
signlat2=signlatlon(document.InputFormCD.NS2)
signlon1=signlatlon(document.InputFormCD.EW1)
signlon2=signlatlon(document.InputFormCD.EW2)


lat1=(Math.PI/180)*signlat1*checkField(document.InputFormCD.lat1)
lat2=(Math.PI/180)*signlat2*checkField(document.InputFormCD.lat2)
lon1=(Math.PI/180)*signlon1*checkField(document.InputFormCD.lon1)
lon2=(Math.PI/180)*signlon2*checkField(document.InputFormCD.lon2)

//alert("lat1=" + lat1 + "lon1=" + lon1 +"\nlat2=" +lat2+ "lon2="+lon2)

dc=dconv(document.OutputFormCD.Dunit) /* get distance conversion factor */
//alert("dc=" +dc)

let ellipse=getEllipsoid(document.OutputFormCD.Model) //get ellipse
//showProps(ellipse,"ellipse")

  // elliptic code
  let cde=crsdist_ell(lat1,-lon1,lat2,-lon2,ellipse)  // ellipse uses East negative
  crs12 =cde.crs12*(180/Math.PI)  
  crs21 =cde.crs21*(180/Math.PI)
  d=cde.d*dc  // go to physical units
  

//alert("d="+d+"  crs12="+crs12+"   crs21="+crs21)
document.OutputFormCD.crs12.value=crs12
document.OutputFormCD.crs21.value=crs21
document.OutputFormCD.d12.value=d
}

function crsdist_ell(glat1,glon1,glat2,glon2,ellipse){
// glat1 initial geodetic latitude in radians N positive 
// glon1 initial geodetic longitude in radians E positive 
// glat2 final geodetic latitude in radians N positive 
// glon2 final geodetic longitude in radians E positive 
const a=ellipse.a
const f=1/ellipse.invf
//alert("a="+a+" f="+f)
var r, tu1, tu2, cu1, su1, cu2, s1, b1, f1, out
var x, sx, cx, sy, cy,y, sa, c2a, cz, e, c, d
var EPS= 0.00000000005
var faz, baz, s
var iter=1
var MAXITER=100
  if ((glat1+glat2===0.) && (Math.abs(glon1-glon2)==Math.PI)){
    alert("Course and distance between antipodal points is undefined")
    glat1=glat1+0.00001 // allow algorithm to complete
    }
  if (glat1===glat2 && (glon1===glon2 || Math.abs(Math.abs(glon1-glon2)-2*Math.PI) <  EPS)){
    alert("Points 1 and 2 are identical- course undefined")
    out=new MakeArray(0)
    out.d=0
    out.crs12=0
    out.crs21=Math.PI
    return out
  }
  r = 1 - f
  tu1 = r * Math.tan (glat1)
  tu2 = r * Math.tan (glat2)
  cu1 = 1. / Math.sqrt (1. + tu1 * tu1)
  su1 = cu1 * tu1
  cu2 = 1. / Math.sqrt (1. + tu2 * tu2)
  s1 = cu1 * cu2
  b1 = s1 * tu2
  f1 = b1 * tu1
  x = glon2 - glon1
  d = x + 1 // force one pass
  while ((Math.abs(d - x) > EPS) && (iter < MAXITER))
    {
      iter=iter+1
      sx = Math.sin (x)
//       alert("sx="+sx)
      cx = Math.cos (x)
      tu1 = cu2 * sx
      tu2 = b1 - su1 * cu2 * cx
      sy = Math.sqrt(tu1 * tu1 + tu2 * tu2)
      cy = s1 * cx + f1
      y = atan2 (sy, cy)
      sa = s1 * sx / sy
      c2a = 1 - sa * sa
      cz = f1 + f1
      if (c2a > 0.)
	cz = cy - cz / c2a
      e = cz * cz * 2. - 1.
      c = ((-3. * c2a + 4.) * f + 4.) * c2a * f / 16.
      d = x
      x = ((e * cy * c + cz) * sy * c + y) * sa
      x = (1. - c) * x * f + glon2 - glon1
    }
  faz = modcrs(atan2(tu1, tu2))
  baz = modcrs(atan2(cu1 * sx, b1 * cx - su1 * cu2) + Math.PI)
  x = Math.sqrt ((1 / (r * r) - 1) * c2a + 1)
  x +=1
  x = (x - 2.) / x
  c = 1. - x
  c = (x * x / 4. + 1.) / c
  d = (0.375 * x * x - 1.) * x
  x = e * cy
  s = ((((sy*sy*4.-3.)*(1.-e-e)*cz*d/6.-x)*d/4.+cz)*sy*d+y)*c*a*r
  out=new MakeArray(0)
  out.d=s
  out.crs12=faz
  out.crs21=baz
  if (Math.abs(iter-MAXITER)<EPS){
    alert("Algorithm did not converge")
  }
  return out

}

//***************Utility***************
function signlatlon(selection){
var sign
if (selection.selectedIndex===0){
   sign=1
}else{
   sign=-1
}
return sign
}

function MakeArray(n){
   this.length=n
   for (var i=1;i<=n;i++){
     this[i]=0
   }
   return this
}

function dconv(selection){
   let dc=new MakeArray(3)
   dc[1]=1.
   dc[2]=1.852 //km
   dc[3]=185200.0/160934.40 // 1.150779448 sm
   dc[4]=185200.0/30.48 // 6076.11549  //ft
   return dc[selection.selectedIndex+1]
}

function ellipsoid(name, a, invf){
  /* constructor */
  this.name=name
  this.a=a
  this.invf=invf
}

function getEllipsoid(selection){
  const no_selections=10
  let ells= new MakeArray(no_selections)
  ells[1]= new ellipsoid("Sphere", 180*60/Math.PI,"Infinite") // first one
  ells[2]= new ellipsoid("WGS84",6378.137/1.852,298.257223563)
  ells[3]= new ellipsoid("NAD27",6378.2064/1.852,294.9786982138)
  ells[4]= new ellipsoid("International",6378.388/1.852,297.0)
  ells[5]= new ellipsoid("Krasovsky",6378.245/1.852,298.3)
  ells[6]= new ellipsoid("Bessel",6377.397155/1.852,299.1528)
  ells[7]= new ellipsoid("WGS72",6378.135/1.852,298.26)
  ells[8]= new ellipsoid("WGS66",6378.145/1.852,298.25)
  ells[9]= new ellipsoid("FAI sphere",6371.0/1.852,1000000000.)
  ells[10]= new ellipsoid("User",0.,0.)  // last one!

  if (selection.selectedIndex+1===no_selections){ // user defined
    ells[no_selections].name="User"
    ells[no_selections].a= document.spheroid.major_radius.value/1.852
    ells[no_selections].invf=document.spheroid.inverse_f.value
    if (ells[no_selections].invf==="Infinite"){
       ells[no_selections].invf=1000000000.
    }
  } else {
//  document.spheroid.major_radius.value=ells[selection.selectedIndex+1].a*1.852
//  document.spheroid.inverse_f.value=ells[selection.selectedIndex+1].invf
  }
  return ells[selection.selectedIndex+1]
}

function parselatlon(instr){
// Parse strings dd.dd dd:mm.mm dd:mm:ss.ss
var deg,min,sec,colonIndex,degstr,minstr,str
str=instr
colonIndex=str.indexOf(":")
if (colonIndex===-1){ // dd.dd?
   if (!isPosNumber(str)){
      badLLFormat(instr)
   return 0.
   } else {
   return parseFloat(str)
   }
} // falls through if we have a colon 

degstr=str.substring(0,colonIndex)  //DD
str=str.substring(colonIndex+1,str.length) //MM...
if (!isPosInteger(degstr)){
   badLLFormat(instr)
   return 0.
} else {
   deg=parseFloat(degstr+".0")
}
//now repeat to pick off minutes
colonIndex=str.indexOf(":")
if (colonIndex===-1){ // dd:mm.mm?
   if (!isPosNumber(str)){
      badLLFormat(instr)
      return 0.
   } else {
   min=parseFloat(str)
   if (min < 60.){
     return deg+parseFloat(str)/60.
   } else {
   badLLFormat(instr)
      return 0.
   }  
   
   }
}// falls through if we have a second colon

minstr=str.substring(0,colonIndex)+".0"  //MM.0
str=str.substring(colonIndex+1,str.length) //SS.SS
if (!isPosNumber(minstr) || !isPosNumber(str)){
  badLLFormat(instr)
  return 0.
} else {
  if ( (parseFloat(minstr) < 60) && (parseFloat(str) < 60.)){
    return deg+ parseFloat(minstr)/60.+parseFloat(str)/3600.
  } else {
    badLLFormat(instr)
    return 0.
  }      
}
}


function badLLFormat(str){
alert(str+ " is an invalid lat/lon format\n"+
            "Use DD.DD DD:MM.MM or DD:MM:SS.SS")
}

function isPosInteger(instr){ //integer only
let str=""+instr // force to string type
for (var i=0;i<str.length;i++) {
  var oneChar=str.charAt(i)
  if (oneChar < "0" || oneChar > "9") {
    return false
  }
}
return true
}

function isPosNumber(instr){ //integer or float
let str=""+instr // force to string type
let oneDecimal=false
for (var i=0;i<str.length;i++) {
  var oneChar=str.charAt(i)
  if (oneChar==="." && !oneDecimal){
     oneDecimal=true
     continue
  }
  if (oneChar < "0" || oneChar > "9") {
    return false
  }
}
return true
}

function checkField(field){
var str=field.name
var latlon
latlon=parselatlon(field.value)
if (str.substring(0,3)==="lat") {
   if (latlon > 90.) {
      alert ("Latitudes cannot exceed 90 degrees")
      field.focus()  // Doesn't work!
      field.select()
   }
}
if (str.substring(0,3)==="lon") {
   if (latlon > 180.) {
      alert ("Longitudes cannot exceed 180 degrees")
      field.focus()
      field.select()      
   }
}
return latlon
}

function acosf(x){ /* protect against rounding error on input argument */
if (Math.abs(x) >1){
    x /=Math.abs(x)
  }
return Math.acos(x)
}

function atan2(y,x){
var out
  if (x <0)            { out= Math.atan(y/x)+Math.PI}
  if ((x >0) && (y>=0)){ out= Math.atan(y/x)}
  if ((x >0) && (y<0)) { out= Math.atan(y/x)+2*Math.PI}
  if ((x===0) && (y>0)) { out= Math.PI/2}
  if ((x===0) && (y<0)) { out= 3*Math.PI/2}  
  if ((x===0) && (y===0)) {
    alert("atan2(0,0) undefined")
    out= 0.
  }  
  return out
}

function mod(x,y){
  return x-y*Math.floor(x/y)
}

function modlon(x){
  return mod(x+Math.PI,2*Math.PI)-Math.PI
}

function modcrs(x){
  return mod(x,2*Math.PI)
}

function modlat(x){
  return mod(x+Math.PI/2,2*Math.PI)-Math.PI/2
}

function degtodm(deg,decplaces){
// returns a rounded string DD:MM.MMMM
var deg1=Math.floor(deg)
var min=60.*(deg-Math.floor(deg))
var mins=format(min,decplaces)
//alert("deg1="+deg1+" mins="+mins)
// rounding may have rounded mins to 60.00-- sigh
if (mins.substring(0,1)=="6" && mins >59.0){
  deg1 +=1
  mins=format(0,decplaces)
}
return deg1+":"+mins
}

function format(expr, decplaces){
var str= "" +Math.round(eval(expr)*Math.pow(10,decplaces))
while (str.length <=decplaces) {
  str= "0" + str
}
var decpoint=str.length-decplaces
return str.substring(0,decpoint)+"."+str.substring(decpoint,str.length)
}


function showProps(obj,objName){
var result=""
for (var i in obj){
result +=objName + "." + i + " = " + obj[i] + "\n"
}
alert(result)
}



