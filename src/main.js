let orderDirection=document.getElementById('orderDirection');
let search_student=document.getElementById('search_student');
let cohortSede=document.getElementById("cohortSede");
let listStudent=document.getElementById("listUsersCohort");//div contenedor mayor
let table=document.getElementById('out_list_student_item');
let imgSearch=document.getElementById('imgSearch');
let search=document.getElementById('search');
let informationUser=document.getElementById('information');
window.onload=function(){
    orderDirection.addEventListener('change',() => {
        //cohortSede.style.display = 'none';
        listStudent.style.display = "block";
        const orderBy = document.getElementById('orderBy');
        orderDirection.style.color="red";
        orderUsers(orderBy.value,orderDirection.value);
       //orderUsers('percent','ASC');
       // 
    });
    imgSearch.addEventListener('click',() =>{// muestro en div table search
        table.style.display='none';
        cohortSede.style.display = 'none';
        listStudent.style.display = "block";
        search_home_students(search_student.value);
    });
    document.getElementById('back-cohort').addEventListener('click',()=>{
        cohortSede.style.display='block';
        listStudent.style.display = "none";
        table.style.display='none';
    });
    document.getElementById('back-list').addEventListener('click',()=>{
        cohortSede.style.display='none';
        listStudent.style.display = "block";
        table.style.display='block';
        search.style.display='block';
        informationUser.style.display="none";
    });
}
let url1='../data/cohorts.json';
let url2='../data/cohorts/lim-2018-03-pre-core-pw/progress.json';
let url3='../data/cohorts/lim-2018-03-pre-core-pw/users.json';
const connectJson = (url,callback) => {
    let xmlhttp = new XMLHttpRequest(); 
    let dateJson;
    xmlhttp.onload =_=> {
            if(xmlhttp.readyState === 4){
                if(xmlhttp.status !== 200){
                    return callback(new Error(`HTTP error: ${xmlhttp.status}`));
                }
                try {
                    callback(null, JSON.parse(xmlhttp.responseText));// devuelve una funcion con dos parametros??
                } catch (err) {
                    callback(err);
                }
            }
    };    
    xmlhttp.open('GET',url);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send();   
};
//...................................................Obtener courses para computeUsersStats()
let options = {
    cohort:null,
    cohortData:{
        users: null,
        progress: null,
    },
    orderBy: 'name',
    orderDirection: 'ASC',
    search: "",
}
const data =_=> {// Funcion que inicializa las funciones asignando los datos del json
    connectJson(url2,(error,jsonProgress) => {
        connectJson(url3,(error,jsonUsers) => {
            connectJson(url1,(error,jsonCohort) => {
            /*let arrayIds=[];
                let courses=[];
                for(var i in jsonCohort){
                    var idCourses=Object.keys(jsonCohort[i].coursesIndex);
                    for(var value in idCourses){
                        let x=idCourses[value];
                        arrayIds.push(x);
                    }  
                    courses=arrayIds.sort().filter((x, i, a) => !i || x != a[i-1]);// 14 idCursos obtenidos
            } 
            */
                options.cohortData.users=jsonUsers;
                options.cohortData.progress=jsonProgress;
                let listUser = processCohortData(options);
            });
        });
    });
}
data();

/*Tabla de informacion div out_list_student_item*/
toCallStats = idCohort => {// Funcion que me permite listar con valores por defecto
                let courses = 'intro';
                document.getElementById("cohortSede").style.display = 'none';
                document.getElementById("listUsersCohort").style.display = "block";
                document.getElementById('title_list_student_item').style.display='none';
                let tableList = document.getElementById('out_list_student_item');
                let num = 0;
                options.cohort=idCohort.id;
                let listUser = processCohortData(options);

                Object.keys(listUser).map(list=>{                    
                    let information=listUser[list];
                    if(idCohort.id == listUser[list].cohort){
                        num++;                                
                        tableList.innerHTML += "<tr id='" + listUser[list].idUser +
                            "' onclick='information(this)' data-name='"+listUser[list].name+
                            "' data-course='"+courses+
                            "' data-percent='"+listUser[list].percent+
                            "' data-ex-total='"+listUser[list].excercises.total+
                            "' data-ex-completed='"+listUser[list].excercises.completed+
                            "' data-ex-percent='"+listUser[list].excercises.percent+
                            "' data-read-total='"+listUser[list].reads.total+
                            "' data-read-completed='"+listUser[list].reads.completed+
                            "' data-read-percent='"+listUser[list].reads.percent+
                            "' data-quiz-total='"+listUser[list].quizzes.total+
                            "' data-quiz-completed='"+listUser[list].quizzes.completed+
                            "' data-quiz-score-avg='"+listUser[list].quizzes.scoreAvg+
                            "' data-quiz-score-sum= '"+listUser[list].quizzes.scoreSum+
                            "' data-quiz-percent='"+listUser[list].quizzes.percent+
                            "'><td>" + num +
                            "</td><td class='name-table'>"+ listUser[list].name+
                            "</td><td class='import'>"+ listUser[list].quizzes.scoreSum+
                            "</td><td>"+ listUser[list].reads.percent+" % "+
                            "</td><td>"+ listUser[list].excercises.percent+" % "+
                            "</td><td>"+ listUser[list].quizzes.percent+" % "+
                            "</td><td class='import'>"+ listUser[list].percent+" % "+
                            "</td></tr>"
                    } 
                    });
                
}
/*Informacion por cada estudiante div information*/
information = (idUser)=> {// Funcion que muestra la informacion detallada por usuario                 
                        document.getElementById("listUsersCohort").style.display = "none";
                        var html_informacion = '<div class = "box-information">';
                                html_informacion+= '<div class="wrap-box-information">';
                                html_informacion+= '<h4 class="info-individual"><span class="icon-left-open" id="back-list"></span>Informacion Detallada</h4>'
                                    html_informacion+= '<p class="name-information"><span >'+idUser.dataset.name+'</span></p>';
                                    html_informacion+= '<select class="select-course"><option>'+idUser.dataset.course+'</option></select>'
                                    html_informacion+= '<div class=info-resumen>'
                                        html_informacion+= '<p><span>Porcentaje:</span>'+idUser.dataset.percent+' %</p>'
                                        html_informacion+= '<p><span>Puntaje:</span>'+idUser.dataset.quizScoreSum+' pts</p>'
                                    html_informacion+='</div>'
                                    html_informacion+='<div class="information-courses">';
                                        html_informacion+='<h3>Ejercicios</h3>'
                                        html_informacion+='<table>'
                                            html_informacion+='<tr class="title-fila"><td>Item</td><td>Valor</td></tr>'
                                            html_informacion+='<tr><td>Total de Ejercicios</td><td>'+idUser.dataset.exTotal+'</td></tr>'
                                            html_informacion+= '<tr><td>Ejercicios Completados</td><td>'+idUser.dataset.exCompleted+'</td></tr>'
                                            html_informacion+= '<tr><td>Avance</td><td>'+idUser.dataset.exPercent+' %</td></tr>'
                                        html_informacion+='</table>'
                                    html_informacion+='</div>';
                                    html_informacion+='<div class="information-courses">';
                                        html_informacion+= '<h3>Lecturas</h3>'
                                        html_informacion+= '<table>'
                                            html_informacion+= '<tr class="title-fila"><td>Item</td><td>Valor</td></tr>'
                                            html_informacion+= '<tr><td>Numero de lecturas</td><td>'+idUser.dataset.readTotal;+'</td></tr>'
                                            html_informacion+= '<tr><td>Ejercicios Completados</td><td>'+idUser.dataset.readCompleted+'</td></tr>'
                                            html_informacion+= '<tr><td>Avance</td><td>'+idUser.dataset.readPercent+'% </td></tr>'
                                        html_informacion+= '</table>'
                                    html_informacion+='</div>';
                                    html_informacion+='<div class="information-courses">';
                                        html_informacion+= '<h3>Examen</h3>'
                                        html_informacion+= '<table>'
                                            html_informacion+= '<tr class="title-fila"><td>Item</td><td>Valor</td></tr>'
                                            html_informacion+= '<tr><td>Numero de examenes</td><td>'+idUser.dataset.quizTotal;+'</td></tr>'
                                            html_informacion+= '<tr><td>Examenes Completados</td><td>'+idUser.dataset.quizCompleted+'</td></tr>'
                                            html_informacion+= '<tr><td>Puntaje</td><td>'+idUser.dataset.quizScoreSum+'</td></tr>'
                                            html_informacion+= '<tr><td>Promedio</td><td>'+idUser.dataset.quizScoreAvg+'</td></tr>'
                                            html_informacion+= '<tr><td>Avance</td><td>'+idUser.dataset.quizPercent+' %</td></tr>'
                                        html_informacion+= '</table>'
                                    html_informacion+='</div>';
                                html_informacion+='</div>';
                            html_informacion+='</div>';
                        document.getElementById('out_list_student_item').style.display='none';
                        document.getElementById('information').innerHTML=html_informacion;
}
/*Ordenar estudiante div out_list_student_item*/
orderUsers = (orderBy, orderDirection)=>{// Funcion que muestra la lista ordenada
                let courses = 'intro';
                let num = 0;
                let tableList = document.getElementById('out_list_student_item');
                tableList.innerHTML=" ";
                options.orderBy = orderBy;
                options.orderDirection = orderDirection;
                let order = processCohortData(options);
                const orderListaDeCohort=options.cohort;
                order.map(date => {
                    if(orderListaDeCohort == date.cohort){
                    num++;                    
                    tableList.innerHTML += "<tr id='" + date.id +
                        "' onclick='information(this)' data-name='"+date.name+
                        "' data-course='"+courses+
                        "' data-percent='"+date.percent+
                        "' data-ex-total='"+date.excercises.total+
                        "' data-ex-completed='"+date.excercises.completed+
                        "' data-ex-percent='"+date.excercises.percent+
                        "' data-read-total='"+date.reads.total+
                        "' data-read-completed='"+date.reads.completed+
                        "' data-read-percent='"+date.reads.percent+
                        "' data-quiz-total='"+date.quizzes.total+
                        "' data-quiz-completed='"+date.quizzes.completed+
                        "' data-quiz-score-avg='"+date.quizzes.scoreAvg+
                        "' data-quiz-score-sum= '"+date.quizzes.scoreSum+
                        "' data-quiz-percent='"+date.quizzes.percent+
                        "'><td>" + num +
                        "</td><td class='name-table'>"+ date.name+
                        "</td><td class='import'>"+ date.quizzes.scoreSum+
                        "</td><td>"+ date.reads.percent+" % "+
                        "</td><td>"+ date.excercises.percent+" % "+
                        "</td><td>"+ date.quizzes.percent+" % "+
                        "</td><td class='import'>"+ date.percent+" % "+
                        "</td></tr>"
                    }
                });
 
}
/*BUscar estudiante div search*/
search_home_students =(string)=> {// La funcion busca la informacion por nombre
                let num = 0; 
                let search = document.getElementById('search');
                let courses = 'intro';
                options.search=string;
                let listUser = processCohortData(options);
                search.innerHTML = "";
                    for(var list in listUser){
                        num++;
                        document.getElementById('title_list_student_item').style.display='block';
                        search.innerHTML += "<tr id='" + listUser[list].idUser +
                        "' onclick='information(this)' data-name='"+listUser[list].name+
                        "' data-course='"+courses+
                        "' data-percent='"+listUser[list].percent+
                        "' data-ex-total='"+listUser[list].excercises.total+
                        "' data-ex-completed='"+listUser[list].excercises.completed+
                        "' data-ex-percent='"+listUser[list].excercises.percent+
                        "' data-read-total='"+listUser[list].reads.total+
                        "' data-read-completed='"+listUser[list].reads.completed+
                        "' data-read-percent='"+listUser[list].reads.percent+
                        "' data-quiz-total='"+listUser[list].quizzes.total+
                        "' data-quiz-completed='"+listUser[list].quizzes.completed+
                        "' data-quiz-score-avg='"+listUser[list].quizzes.scoreAvg+
                        "' data-quiz-score-sum= '"+listUser[list].quizzes.scoreSum+
                        "' data-quiz-percent='"+listUser[list].quizzes.percent+
                        "'><td>" + num +
                        "</td><td class='name-table'>"+ listUser[list].name+
                        "</td><td class='import'>"+ listUser[list].quizzes.scoreSum+
                        "</td><td>"+ listUser[list].reads.percent+" % "+
                        "</td><td>"+ listUser[list].excercises.percent+" % "+
                        "</td><td>"+ listUser[list].quizzes.percent+" % "+
                        "</td><td class='import'>"+ listUser[list].percent+" % "+
                        "</td></tr>"
                
                    }   
            
}
/*Listar cohort por sede */
loadCohortSede = ids =>{// Selecciona lista de cohort
    connectJson(url1,(error,json) => {
        let menu=document.getElementById("menuCohort");
        let div=document.createElement('div');//creo un elemnto div
        div.setAttribute('id','cohortOne')// le asigno un atributo
        menu.appendChild(div);// lo asigno al padre
       
        let divList = document.getElementById('cohortOne');
        let sede=json.filter(function(el){
            const sedeJSON=el.id;
            return sedeJSON.toLowerCase().indexOf(ids.toLowerCase()) > -1;
        });
        if(divList.innerHTML == ""){
        for(var q in sede){
                divList.innerHTML += "<ul id='contentCohort'><li class='menuList'><span id='" + sede[q].id + "' onclick='toCallStats(this)'>" + sede[q].id + "</span></li></ul>";
           }
        }else{
            divList.parentNode.removeChild(divList);
        }
    });
    
}

