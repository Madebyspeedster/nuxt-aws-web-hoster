<template>
  <div class="svg-container" ref="dropZone">
    <div class="drop-zone">{{ prompt }}</div>

    <div class="html-icon">
      <img src="~/assets/html-file.png" alt="html doc" />
    </div>
    <div class="website-icon">
      <img src="~/assets/website.png" alt="web page" />
    </div>

    <svg
      ref="svg"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
    ></svg>

    <LinkModal
      v-if="showModal"
      :visible="showModal"
      :link="uploadedLink"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";

import LinkModal from "~/components/LinkModal.vue";

const dropZoneX = 400;
const dropZoneY = 300;

const incomingLine = {
  startX: 150,
  startY: 350,
  midX: 150,
  midY: 300,
  endX: dropZoneX,
  endY: dropZoneY,
};

const outgoingLine = {
  startX: dropZoneX,
  startY: dropZoneY,
  midX: 650,
  midY: 300,
  endX: 650,
  endY: 250,
};

const dropZone = ref(null);
const svg = ref(null);
const prompt = ref("Drop File");

const showModal = ref(false);
const uploadedLink = ref("");

const uploadFile = async (file) => {
  try {
    prompt.value = "Loading...";
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result.split(",")[1];

      const response = await $fetch("/api/upload", {
        method: "POST",
        body: {
          fileName: file.name,
          contentType: file.type,
          fileContent: base64Content,
        },
      });

      uploadedLink.value = response.link;
      showModal.value = true;
    };

    await new Promise((resolve) => resolve(reader.readAsDataURL(file)));
  } catch (error) {
    alert("Failed to upload file.");
  } finally {
    prompt.value = "Drop File";
  }
};

const closeModal = () => {
  showModal.value = false;
};

const animateLine = (path, direction) => {
  const pathLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", `${pathLength}, ${pathLength}`)
    .attr("stroke-dashoffset", pathLength);

  const duration = 2000;
  if (direction === "in") {
    path
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0)
      .on("end", () => {
        path.attr("stroke-dashoffset", pathLength);
        animateLine(path, "in");
      });
  } else if (direction === "out") {
    path
      .transition()
      .duration(duration * 2)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", -pathLength)
      .on("end", () => {
        path.attr("stroke-dashoffset", 0);
        animateLine(path, "out");
      });
  }
};

onMounted(() => {
  const svgElement = d3.select(svg.value);

  [incomingLine, outgoingLine].forEach(
    ({ startX, startY, midX, midY, endX, endY }) => {
      svgElement
        .append("path")
        .attr("d", `M${startX},${startY} L${midX},${midY} L${endX},${endY}`)
        .attr("class", "line");
    }
  );

  const incomingPath = svgElement
    .append("path")
    .attr(
      "d",
      `M${incomingLine.startX},
       ${incomingLine.startY} L${incomingLine.midX},
       ${incomingLine.midY} L${incomingLine.endX},
       ${incomingLine.endY}`
    )
    .attr("class", "animated-line");

  animateLine(incomingPath, "in");

  setTimeout(() => {
    const outgoingPath = svgElement
      .append("path")
      .attr(
        "d",
        `M${outgoingLine.startX},
        ${outgoingLine.startY} L${outgoingLine.midX},
        ${outgoingLine.midY} L${outgoingLine.endX},
        ${outgoingLine.endY}`
      )
      .attr("class", "animated-line");
    animateLine(outgoingPath, "out");
  }, 1500);

  dropZone.value.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.value.classList.add("drag-over");
  });

  dropZone.value.addEventListener("dragleave", () => {
    dropZone.value.classList.remove("drag-over");
  });

  dropZone.value.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.value.classList.remove("drag-over");

    const droppedFiles = e.dataTransfer?.files;
    if (!droppedFiles || droppedFiles.length === 0) {
      alert("No file dropped!");
      return;
    }

    const file = droppedFiles[0];
    if (!file.name.endsWith(".html")) {
      alert("Only .html files are allowed!");
      return;
    }

    await uploadFile(file);
  });
});
</script>

<style>
img {
  user-select: none;
  width: 100%;
  -webkit-user-drag: none;
}

.svg-container {
  position: relative;
  max-width: 1000px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: dashed;
  border-width: var(--line-stroke-width);
  border-color: var(--line-stroke);
}

.drop-zone {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 50px;
  background: var(--drop-zone-bg);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  color: var(--drop-zone-border);
  box-shadow: var(--drop-zone-border) 0px 6px 24px 0px,
    var(--drop-zone-border) 0px 0px 0px 1px;
}

.svg-container.drag-over {
  background: var(--drop-zone-hover-bg);
  color: var(--drop-zone-hover-color);
  border: 2px dashed var(--drop-zone-hover-border);
  transition: background ease-in 0.3s;
}

.html-icon,
.website-icon {
  position: absolute;
  width: 80px;
}

.html-icon {
  top: 55%;
  left: 15%;
}

.website-icon {
  top: 35%;
  right: 15%;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.line {
  stroke: var(--line-stroke);
  stroke-width: var(--line-stroke-width);
  fill: none;
}

.animated-line {
  stroke: var(--animated-line-stroke);
  stroke-width: var(--animated-line-stroke-width);
  stroke-dasharray: 20, 280;
  stroke-linecap: round;
  fill: none;
}
</style>
