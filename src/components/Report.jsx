import { React, useEffect, useRef, useState } from 'react';
import { axisBottom, axisLeft } from "d3-axis";
import { max, rollup } from 'd3-array';
import { csv } from 'd3-fetch';
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { pie, arc } from "d3-shape";
import { schemeCategory10 } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { transition } from "d3-transition"
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const csvDelLolillo = await csv("200125_LoL_champion_data.csv");
const dificultadesHeroes = [...new Set(csvDelLolillo.map(d => d.difficulty))].sort((a, b) => a.localeCompare(b));
const dificultadesHeroes2 = [...dificultadesHeroes];
const clasesHeroes = [...new Set(csvDelLolillo.map(d => d.herotype))].sort((a, b) => a.localeCompare(b));
const clasesHeroes2 = [...clasesHeroes];

export const Report = () => {
  const difSeleccionado = useRef(null);
  const thSeleccionado = useRef(null);
  const graficoCircular = useRef(null);
  const graficoBarras = useRef(null);

  const [combinacionDifTipoVacia, setCombinacionDifTipoVacia] = useState(false);
  const [cuentaRecursos, setCuentaRecursos] = useState([]);
  const [esenciaAzulCampeones, setEsenciaAzulCampeones] = useState([]);

  useEffect(() => {
    const mapaRecursos = rollup(
      csvDelLolillo,
      (v) => v.length,
      (campeon) => campeon.resource
    );

    const arrayRecursos = Array.from(mapaRecursos, ([recurso, cuenta]) => ({
      recurso,
      cuenta,
    }));

    setCuentaRecursos(arrayRecursos);
  }, [])

  useEffect(() => {
    const mapaCampeones = csvDelLolillo.map((campeon) => ({
      nombre: campeon[""],
      esenciaAzul: +campeon.be,
    }));

    setEsenciaAzulCampeones(mapaCampeones);
  }, []);

  useEffect(() => {
    if (cuentaRecursos.length === 0) return;

    const ancho = 512;
    const alto = 512;
    const radio = Math.min(ancho, alto) / 2;

    const svg = select(graficoCircular.current).html("").append("svg")
      .attr("width", ancho)
      .attr("height", alto)
      .style("overflow", "visible")
      .append("g")
      .attr("transform", `translate(${ancho / 2},${alto / 2})`);

    const color = scaleOrdinal(schemeCategory10);

    const pieGenerator = pie().value((d) => d.cuenta);
    const arcGenerator = arc().innerRadius(0).outerRadius(radio);
    const arcHover = arc().innerRadius(0).outerRadius(radio + 10);

    const arcs = svg.selectAll("arc")
      .data(pieGenerator(cuentaRecursos))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data.recurso))
      .attr("stroke", "white")
      .attr("stroke-width", 0)
      .on("mouseover", function (event, d) {
        
        const path = select(this);
        
        path
          .transition()
          .duration(200)
          .attr("d", arcHover);

        svg.append("text")
          .attr("class", "hover-text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .text(`${d.data.recurso}: ${d.data.cuenta} campeones`);

      })
      .on("mouseout", function () {
        const path = select(this);
        
        path
          .transition()
          .duration(200)
          .attr("d", arcGenerator);

        svg.selectAll(".hover-text").remove();
        
    });

    arcs.append("text")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text((d) => {
        return d.endAngle - d.startAngle > 0.15 ? d.data.recurso : ""
      });
  }, [cuentaRecursos]);

  useEffect(() => {
    if (!esenciaAzulCampeones.length) return;

    const anchoMinimo = 800;
    const anchoDinamico = Math.max(esenciaAzulCampeones.length * 12, anchoMinimo);
    const alto = 500;
    const margen = { superior: 20, derecho: 30, inferior: 80, izquierdo: 60 };

    const svg = select(graficoBarras.current)
      .attr("width", anchoDinamico)
      .attr("height", alto);

    svg.selectAll("*").remove();

    const escalaX = scaleBand()
      .domain(esenciaAzulCampeones.map((campeon) => campeon.nombre))
      .range([margen.izquierdo, anchoDinamico - margen.derecho])
      .padding(0.2);

    const escalaY = scaleLinear()
      .domain([0, max(esenciaAzulCampeones, (campeon) => campeon.esenciaAzul)])
      .nice()
      .range([alto - margen.inferior, margen.superior]);

    svg.append("g")
      .attr("transform", `translate(0,${alto - margen.inferior})`)
      .call(axisBottom(escalaX).tickFormat((nombre) => nombre).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margen.izquierdo},0)`)
      .call(axisLeft(escalaY));
    
    const tooltip = select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(30, 35, 40, 0.7)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("display", "none")
      .style("font-size", "14px");

    svg.selectAll(".barra")
      .data(esenciaAzulCampeones)
      .enter().append("rect")
      .attr("class", "barra")
      .attr("x", (campeon) => escalaX(campeon.nombre))
      .attr("y", (campeon) => escalaY(campeon.esenciaAzul))
      .attr("height", (campeon) => alto - margen.inferior - escalaY(campeon.esenciaAzul))
      .attr("width", escalaX.bandwidth())
      .attr("fill", "#0397AB")
      .on("mouseover", (evento, campeon) => {
        select(evento.target)
          .transition()
          .duration(200)
          .attr("fill", "#C8AA6E");

        tooltip
          .style("display", "block")
          .html(`<strong>${campeon.nombre}</strong><br>${campeon.esenciaAzul} BE`)
          .style("left", `${evento.pageX + 10}px`)
          .style("top", `${evento.pageY - 20}px`);
      })
      .on("mousemove", (evento) => {
        tooltip
          .style("left", `${evento.pageX + 10}px`)
          .style("top", `${evento.pageY - 20}px`);
      })
      .on("mouseout", (evento) => {
        select(evento.target)
          .transition()
          .duration(200)
          .attr("fill", "#0397AB");

        tooltip.style("display", "none");
      });

  }, [esenciaAzulCampeones]);
  
  const posTextoCentradoHorizontal = (documento, texto) => {
    return (documento.internal.pageSize.width - documento.getTextWidth(texto))/2;
  }

  const manejarImprimir = (e) => {
    e.preventDefault();

    const diff = difSeleccionado.current.value
    const clase = thSeleccionado.current.value

    const pdfCampeones = new jsPDF({orientation: "landscape"});
    const campeonesFiltrados = csvDelLolillo.filter(campeon => {
      return campeon.difficulty === diff && 
            campeon.herotype === clase;
    });

    if(campeonesFiltrados.length === 0){
      setCombinacionDifTipoVacia(true);
      return;
    }

    setCombinacionDifTipoVacia(false);
    //console.log("Datos filtrados:", campeonesFiltrados[0].client_positions[4]);

    const titulo = "Campeones del Lolillo";
    const encabezado = `Dificultad: ${diff} Tipo: ${clase}`;
    const piePagina = `En este documento, se muestran los datos de aquellos campeones de League of Legends que tienen una dificultad de ${diff} (nivel de habilidad necesario para usarlo con eficacia) y son de clase ${clase}.\nLa columna Estilo representa la preferencia de un campeón por usar ataques básicos o habilidades, siendo 0 la preferencia total por los ataques básicos y 100 la preferencia total por las habilidades.`;
    const nombreArchivoPDF = `LoL_campeones_dif_${diff}_clase_${clase}.pdf`

    pdfCampeones.setFontSize(24);
    pdfCampeones.text(titulo, posTextoCentradoHorizontal(pdfCampeones, titulo), 10);
    pdfCampeones.setFontSize(16);
    pdfCampeones.text(encabezado, posTextoCentradoHorizontal(pdfCampeones, encabezado), 20);
    pdfCampeones.autoTable({
      startY: 25,
      margin: { bottom: 10 },
      pageBreak: "auto",
      showHead: "everyPage",
      showFoot: "everyPage",
      tableLineWidth: 1,
      head: [["Nombre y título", "Diff", "Clase", "Clase sec.", "Recurso", "Rango", "Daño", "Resistencia", "Control", "Mobilidad", "Utilidad", "Estilo"]],
      body: campeonesFiltrados.map(campeon => [campeon[""] + ", \"" + campeon.title + "\"", campeon.difficulty, campeon.herotype, campeon.alttype, campeon.resource, campeon.rangetype, campeon.damage, campeon.toughness, campeon.control, campeon.mobility, campeon.utility, campeon.style]),
      foot: [["Nombre y título", "Diff", "Clase", "Clase sec.", "Recurso", "Rango", "Daño", "Resistencia", "Control", "Mobilidad", "Utilidad", "Estilo"]],
    })
    pdfCampeones.setFontSize(14);
    pdfCampeones.text(pdfCampeones.splitTextToSize(piePagina, pdfCampeones.internal.pageSize.width - 30), 15, pdfCampeones.autoTable.previous.finalY + 10, {overflow: "linebreak"})
    pdfCampeones.save(nombreArchivoPDF);
  }

  return (
    <>
      <form onSubmit={manejarImprimir}>
        <label>Dificultad: 
          <select name="dificultadesHeroes" id="dificultadesHeroes" ref={difSeleccionado}>
            {dificultadesHeroes.map((dificultadesHeroes, index) =>
              <option value={dificultadesHeroes}>{dificultadesHeroes2[index]}</option>
            )}
          </select>
        </label>
        <label>Clase: 
          <select name="clasesHeroes" id="clasesHeroes" ref={thSeleccionado}>
            {clasesHeroes.map((clasesHeroes, index) =>
              <option value={clasesHeroes}>{clasesHeroes2[index]}</option>
            )}
          </select>
        </label>
        <button type="submit">Imprimir</button>
      </form>
      {combinacionDifTipoVacia && <p>No hay ningún héroe con esa combinación de dificultad y de clase</p>}
      <br/>
      <p>Cantidad de campeones por recurso que utilizan</p>
      <div ref={graficoCircular}/>
      <br/>
      <p>Cada campeón y su costo en Esencia Azul</p>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg ref={graficoBarras}></svg>
      </div>
    </>
  )
}
