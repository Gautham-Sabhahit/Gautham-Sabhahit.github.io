---
layout: default
title: Mass-Luminosity Calculator
---

<style>
  body {
    padding: 20px;
    text-align: center;
  }

  h1, h2, p, label {
    margin-bottom: 15px;
  }

  #luminosity-form {
    margin-bottom: 20px;
    display: inline-block;
    text-align: left;
  }

  input, button {
    margin-top: 5px;
    width: 200px;
    padding: 5px;
    text-align: left;
  }

  #luminosity-output {
    padding: 20px;
    border: 1px solid #ccc;
    margin-top: 20px;
    background-color: #f9f9f9;
    width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  #intro-text {
    font-size: 1.2em;
    max-width: 1200px;
    margin: 0 auto 30px auto;
    text-align: justify;
  }

  [data-theme="dark"] .box {
    background-color: #222 !important;
    color: #eee !important;
    box-shadow: 0 0 10px rgba(255,255,255,0.2) !important;
    border-color: #444 !important;
  }

  [data-theme="dark"] .box input,
  [data-theme="dark"] .box select,
  [data-theme="dark"] .box button {
    background-color: #444 !important;
    color: #eee !important;
    border: 1px solid #666 !important;
  }

  [data-theme="dark"] .box input::placeholder {
    color: #bbb !important;
  }
</style>


<div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 30px;">

  <div class="box" style="width: 800px; background-color: #f5f5f5; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="text-align: center; font-size: 1em;">How to Use</h2>
    <p style="font-size: 0.8em; text-align: justify;">
      Please select the required calculator and enter either stellar mass or luminosity, hydrogen and metal abundances as mass fractions. Selecting an option from the dropdown below will load the appropriate calculator. Pressing the calculate button will provide the minimum, maximum, and pure-He values for the user input parameters. For more details regarding the structure model grid, see the text description below
    </p>
    <p style="font-size: 0.8em;"><strong>Grid parameter range:</strong></p>
    <p style="font-size: 0.8em; text-align: justify;">
      1. For M, the chemically homogeneous structure models (H profile slope of 0) and pure-He models (H profile slope of inf) have the range 1 ≤ M/Msun ≤ 40, while the structure models with H profile slope in between these two extremes have the range 1 ≤ M/Msun ≤ 18. 
    </p>
    <p style="font-size: 0.8em; text-align: justify;">
      2. For surface H mass fraction, the range is 0 ≤ X ≤ 0.7
    </p>
    <p style="font-size: 0.8em; text-align: justify;">
      3. For surface metal mass fraction, the values are Z = 0.008 (LMC-like, 0.4Zsun) and Z = 0.004 (SMC-like, 0.2Zsun) where Zsun = 0.02.
    </p>
    <p style="font-size: 0.8em;"><strong>Warnings and Errors:</strong></p>
    <p style="font-size: 0.8em; text-align: justify;">
      1. Errors are displayed if the inputs are not valid numbers, or if the mass is zero or negative, or if X or Z is negative. X = 0 and Z = 0 are allowed.
    </p>
    <p style="font-size: 0.8em; text-align: justify;">
      2. A set of warnings is printed based on the parameter range of the synthetic model grid. If the inputs fall outside the grid’s tested parameter range, a general warning is shown. If the inputs are significantly beyond the grid range such that the minimum or maximum value of M or L is not truly a minimum or maximum, then a warning is issued indicating that the ML fits may be unreliable. If a calculation fails, especially in the mass calculator, an error is issued.
    </p>
    <p style="font-size: 0.8em; text-align: justify;">
      3. The model grid was computed for Z = 0.008 and Z = 0.004. For any Z value other than 0.008 or 0.004, interpolation or extrapolation is performed, and a corresponding warning is provided.
    </p>
  </div>

  <select id="calculator-type" style="width: 250px; padding: 8px; font-size: 0.9em;">
    <option value="" disabled selected>Select Calculator</option>
    <option value="luminosity">Luminosity Calculator</option>
    <option value="mass">Mass Calculator</option>
  </select>

  <div id="calculator-container"></div>
</div>

<script>
  let calculatorContainer = document.getElementById('calculator-container');

  const luminosityHTML = `
    <div class="box" style="width: 800px; background-color: #f5f5f5; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 20px;">
      <form id="luminosity-form" style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        <input type="number" id="m" step="any" required placeholder="Mass, M/M☉" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <input type="number" id="x" step="any" required placeholder="Hydrogen Mass Fraction, X" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <input type="number" id="z" step="any" required placeholder="Metal mass fraction, Z" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <button type="button" id="calculate-luminosity" style="width: 220px; padding: 8px; font-size: 0.8em;">Calculate Luminosity</button>
      </form>
      <div id="luminosity-output" style="margin-top: 20px; text-align: center; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #f5f5f5;"><p style="font-size: 0.85em;">Results will appear here.</p></div>
    </div>
  `;

  const massHTML = `
    <div class="box" style="width: 800px; background-color: #f5f5f5; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 20px;">
      <form id="mass-form" style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
        <input type="number" id="l" step="any" required placeholder="Luminosity, log(L/L☉)" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <input type="number" id="x_mass" step="any" required placeholder="Hydrogen Mass Fraction, X" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <input type="number" id="z_mass" step="any" required placeholder="Metal mass fraction, Z" style="width: 250px; padding: 8px; font-size: 0.8em;">
        <button type="button" id="calculate-mass" style="width: 220px; padding: 8px; font-size: 0.8em;">Calculate Mass</button>
      </form>
      <div id="mass-output" style="margin-top: 20px; text-align: center; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #f5f5f5;"><p style="font-size: 0.85em;">Results will appear here.</p></div>
    </div>
  `;

  document.getElementById('calculator-type').addEventListener('change', (e) => {
    if (e.target.value === 'luminosity') {
      calculatorContainer.innerHTML = luminosityHTML;
    } else if (e.target.value === 'mass') {
      calculatorContainer.innerHTML = massHTML;
    } else {
      calculatorContainer.innerHTML = '';
    }
  });




















function attachLuminosityListener() {
  document.getElementById('calculate-luminosity').addEventListener('click', () => {
    const mVal = document.getElementById('m').value;
    const xVal = document.getElementById('x').value;
    const zVal = document.getElementById('z').value;

    const M = parseFloat(mVal);
    const X = parseFloat(xVal);
    const Z = parseFloat(zVal);

    const output = document.getElementById('luminosity-output');

    if (isNaN(M) || isNaN(X) || isNaN(Z)) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: All inputs must be valid numbers</p>';
      return;
    }
    if (M <= 0 || X < 0 || Z < 0) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: Yea, nice try :) Zero or negative input(s)</p>';
      return;
    }
    if (X + Z > 1) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: Yea, nice try :) X + Z > 1</p>';
      return;
    }

    fetch('https://nnv5wacde8.execute-api.eu-north-1.amazonaws.com/ML-calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice: '1', M, X, Z })
    })
    .then(res => res.json())
    .then(data => {
      let warnings = '';
      let result = '';
      const Z1 = 0.004;
      const Z2 = 0.008;

      const L_min = parseFloat(data.L_min);
      const L_max = parseFloat(data.L_max);
      const L_he  = parseFloat(data.Pure_He_Luminosity);
      const s     = parseFloat(data.s);

      const ValidLums = (
        (X === 0 && !isNaN(L_he)) ||
        (X > 0 && !isNaN(L_min) && !isNaN(L_max) && !isNaN(L_he))
      );

      const unreliable = (
        (X === 0 && isNaN(L_he)) ||
        (X > 0 && (isNaN(L_min) || isNaN(L_max) || isNaN(L_he))) ||
        (L_min > L_max || L_min > L_he || L_max < L_he)
      );

      if (!ValidLums) {
        output.innerHTML = '<p style="color: red; font-size: 16px;">Error: One or more inputs are well beyond the grid range. The fit calculations failed.</p>';
        return;
      }

      if (X === 0) {
        result = `<p style="font-size: 1.1em;">log(L<sub>He</sub>/L<sub>⊙</sub>) = ${L_he.toFixed(5)}, &nbsp; slope = inf</p>`;
      } else {
        result = `
          <p style="font-size: 1em;">log(L<sub>min</sub>/L<sub>⊙</sub>) = ${L_min.toFixed(5)}, &nbsp; slope = 0</p>
          <p style="font-size: 1em;">log(L<sub>max</sub>/L<sub>⊙</sub>) = ${L_max.toFixed(5)}, &nbsp; slope = ${s.toFixed(2)}</p>
          <p style="font-size: 1em;">log(L<sub>He</sub>/L<sub>⊙</sub>) = ${L_he.toFixed(5)}, &nbsp; slope = inf</p>`;
      }

      if (unreliable) {
        warnings = '<p style="color: orange; font-size: 16px;">Warning(s): One or more inputs are well beyond the grid range. The fit calculations may not be reliable.</p>';
        output.innerHTML = result + warnings;
        return;
      }

      if (M < 1 || M > 18) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Input mass is outside the grid range for L_max (1 ≤ M/Msun ≤ 18)</p>';
      }     
      if (M < 1 || M > 40) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Input mass is outside the grid range for L_min and L_He (1 ≤ M/Msun ≤ 40)</p>';
      }
      if (X > 0.7) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Input X is outside grid range (0 ≤ X ≤ 0.7)</p>';
      } 
      if (Z !== Z1 && Z !== Z2) {
        if (Z > Math.min(Z1, Z2) && Z < Math.max(Z1, Z2)) {
          warnings += '<p style="color: orange; font-size: 16px;">Warning: Luminosity and slope values are interpolated between Z = 0.008 and 0.004</p>';
        } else {
          warnings += '<p style="color: orange; font-size: 16px;">Warning: Luminosity and slope values are extrapolated beyond Z = 0.008 and 0.004</p>';
        }
      }

      output.innerHTML = result + warnings;
    })
    .catch(error => {
      output.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
    });
  });
}


function attachMassListener() {
  document.getElementById('calculate-mass').addEventListener('click', () => {
    const lVal = document.getElementById('l').value;
    const xVal = document.getElementById('x_mass').value;
    const zVal = document.getElementById('z_mass').value;

    const L = parseFloat(lVal);
    const X = parseFloat(xVal);
    const Z = parseFloat(zVal);

    const output = document.getElementById('mass-output');

    if (isNaN(L) || isNaN(X) || isNaN(Z)) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: All inputs must be valid numbers</p>';
      return;
    }
    if (L <= 0 || X < 0 || Z < 0) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: Yea, nice try :) Zero or negative input(s)</p>';
      return;
    }
    if (X + Z > 1) {
      output.innerHTML = '<p style="color: red; font-size: 16px;">Error: Yea, nice try :) X + Z > 1</p>';
      return;
    }

    fetch('https://nnv5wacde8.execute-api.eu-north-1.amazonaws.com/ML-calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice: '2', L, X, Z })
    })
    .then(res => res.json())
    .then(data => {
      let warnings = '';
      let result = '';
      const Z1 = 0.004;
      const Z2 = 0.008;

      const m_min = parseFloat(data.M_min);
      const m_max = parseFloat(data.M_max);
      const m_he  = parseFloat(data.Pure_He_Mass);
      const s     = parseFloat(data.s);

      const ValidMasses = (
        (X === 0 && !isNaN(m_he)) ||
        (X > 0 && !isNaN(m_min) && !isNaN(m_max) && !isNaN(m_he))
      );

      const unreliable = (
        (X === 0 && isNaN(m_he)) ||
        (X > 0 && (isNaN(m_min) || isNaN(m_max) || isNaN(m_he))) ||
        (m_min > m_max || m_min > m_he || m_max < m_he)
      );

      if (!ValidMasses) {
        output.innerHTML = '<p style="color: red; font-size: 16px;">Error: One or more inputs are well beyond the grid range. The fit calculations failed.</p>';
        return;
      }

      if (X === 0) {
        result = `<p style="font-size: 1.1em;">M<sub>He</sub>/M<sub>⊙</sub> = ${m_he.toFixed(5)}, &nbsp; slope = inf</p>`;
      } else {
        result = `
          <p style="font-size: 1em;">M<sub>min</sub>/M<sub>⊙</sub> = ${m_min.toFixed(5)}, &nbsp; slope = ${s.toFixed(2)}</p>
          <p style="font-size: 1em;">M<sub>max</sub>/M<sub>⊙</sub> = ${m_max.toFixed(5)}, &nbsp; slope = 0</p>
          <p style="font-size: 1em;">M<sub>He</sub>/M<sub>⊙</sub> = ${m_he.toFixed(5)}, &nbsp; slope = inf</p>`;
      }

      if (unreliable) {
        warnings = '<p style="color: orange; font-size: 16px;">Warning(s): One or more inputs are well beyond the grid range. The fit calculations may not be reliable.</p>';
        output.innerHTML = result + warnings;
        return;
      }

      if (m_min < 1 || m_min > 18) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Output M_min is outside grid range (1 ≤ M/Msun ≤ 18)</p>';
      }
      if (m_max < 1 || m_max > 40) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Output M_max is outside grid range (1 ≤ M/Msun ≤ 40)</p>';
      }
      if (m_he < 1 || m_he > 40) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Output M_He is outside grid range (1 ≤ M/Msun ≤ 40)</p>';
      }
      if (X > 0.7) {
        warnings += '<p style="color: orange; font-size: 16px;">Warning: Input X is outside grid range (0 ≤ X ≤ 0.7)</p>';
      }
      if (Z !== Z1 && Z !== Z2) {
        if (Z > Math.min(Z1, Z2) && Z < Math.max(Z1, Z2)) {
          warnings += '<p style="color: orange; font-size: 16px;">Warning: Mass and slope values are interpolated between Z = 0.008 and 0.004</p>';
        } else {
          warnings += '<p style="color: orange; font-size: 16px;">Warning: Mass and slope values are extrapolated beyond Z = 0.008 and 0.004</p>';
        }
      }

      output.innerHTML = result + warnings;
    })
    .catch(error => {
      output.innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
    });
  });
}






  function renderCalculator(selected) {
    calculatorContainer.innerHTML = selected === 'luminosity' ? luminosityHTML : massHTML;
    if (selected === 'luminosity') attachLuminosityListener();
    if (selected === 'mass') attachMassListener();
  }

  const calculatorTypeSelect = document.getElementById('calculator-type');

  calculatorTypeSelect.addEventListener('change', function () {
    const selected = this.value;
    localStorage.setItem('selectedCalculator', selected);
    renderCalculator(selected);
  });

  window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('selectedCalculator');
    if (saved) {
      calculatorTypeSelect.value = saved;
      renderCalculator(saved);
    }
  });
</script>





<div id="intro-text">
  <p>
   Welcome to the Mass-Luminosity Relation (MLR) Calculator page. This web interface enables users to compute minimum, maximum, and pure-helium mass-luminosity relations (MLR), based on the stellar structure models presented in Sabhahit et al. (2025b). This work builds upon existing MLRs in the literature by incorporating structure models featuring a helium (He) core and hydrogen (H) shell - configurations that can result from partial envelope stripping and appear to break simple homology relations.
  </p>

  <p><strong>MLRs in the literature</strong></p>
  <p>
    Typically, based on homology relations \(L \sim \mu^4 M^3\), the minimum luminosity for a given total mass \(M_\mathrm{tot}\) and surface hydrogen mass fraction \(X_\mathrm{H}\) occurs for a fully chemically homogeneous star with \(X(m) = X_\mathrm{H}\). The maximum luminosity occurs for a pure-He model configuration with \(X(m) = 0\), which, from an evolutionary perspective, corresponds to full envelope stripping. Conversely, the maximum mass for a given luminosity and surface \(X_\mathrm{H}\) occurs for a chemically homogeneous star while the minimum mass occurs for a pure-He model. Such maximum and minimum MLRs are provided in Gräfener et al. (2011).
  </p>

  <p><strong>How do we build upon this?</strong></p>
  <p>In Sabhahit et al. (2025b), we construct a large grid of stellar structure models consisting of a pure-He core with an overlying hydrogen shell. The grid is generated by varying four primary parameters: the total mass \(M_\mathrm{tot}\), the surface hydrogen mass fraction \(X_\mathrm{H}\), the metal mass fraction \(Z\), and the H profile slope \(s\) (the definition of slope follows Schootemeijer & Langer 2018) that governs how \(X_\mathrm{H}\) depletes from the surface value to zero at the edge of the pure-He core. The two limiting cases, \(s = 0\) and \(s = \infty\), correspond to the previously known MLRs for fully chemically homogeneous and pure-He configurations, respectively. However, a broad set of new structure models emerges between these two extremes, where the star possesses a relatively massive He-burning core and a low-mass H-burning shell. From an evolutionary perspective, such a structure can result from partial stripping of the envelope via strong single-star wind mass loss or through stable mass transfer beyond the main sequence via Roche lobe overflow.</p>

  <p>The inclusion of such He-core + low-mass H-shell structures leads to very interesting MLRs because the H shell can contribute disproportionately to the total luminosity budget. What do we mean by that? See <strong>Figure 1</strong>, where we show the internal luminosity stratification of a \( 5 \, M_\odot \) model consisting of a \( 4 \, M_\odot \) core and a \( 1 \, M_\odot \) hydrogen envelope. The surface \(X_\mathrm{H}\) is 0.3 and the H profile slope is \(s = 2\). The two spikes in the nuclear energy generation rate mark the two burning regions. The H shell, despite occupying only one-fifth of the total mass, contributes about three-fourths to the total luminosity. This example structure model outputs a total luminosity greater than that of a pure-He model of the same mass, thereby breaking the homology relations. </p>

  <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0;">
    <div style="text-align: center;">
      <img src="https://gautham-sabhahit.github.io/images/chemical_profile_structure_L.png" alt="Figure 1" style="max-width: 100%; width: 550px; border: 1px solid #ccc; padding: 5px;">
      <p><em>Figure 1:</em> Luminosity stratification of a \( 5 \, M_\odot \) model with a \( 4 \, M_\odot \) He core and \( 1 \, M_\odot \) H shell. The two spikes in the specific nuclear energy generation rate at \(0\) and \( 4 \, M_\odot \) marks the He burning core and the H burning shell.</p>
    </div>
    <div style="text-align: center;">
      <img src="https://gautham-sabhahit.github.io/images/max_s_max_L_M5.0.png" alt="Figure 2" style="max-width: 100%; width: 550px; border: 1px solid #ccc; padding: 5px;">
      <p><em>Figure 2:</em> Variation of luminosity as a function of slope \( (0 \leq s \leq \infty) \) for different values of surface \( X_\mathrm{H} \). The total mass \( M_{\text{tot}} \) is fixed at \( 5\, M_{\odot} \). The figure shows the luminosity peak at an \( s \)-value between the extremes \( s = 0 \) and \( s = \infty \).</p>
    </div>
  </div>

  <p>In <strong>Figure 2</strong>, we plot the variation of surface luminosity with slope \( s \) for different values of surface \( X_\mathrm{H} \), while fixing \( M_\mathrm{tot} \) to \( 5 \, M_\odot \). We observe that for a given \( M_\mathrm{tot} \) and \( X_\mathrm{H} \), the minimum luminosity still corresponds to the \( s = 0 \) chemically homogeneous model. However, the <strong>maximum luminosity</strong> does <strong>not</strong> occur for the \( s = \infty \) pure-He model, but rather at an intermediate slope with a He-core + H-shell structure corresponding to partial stripping. Similarly, the <strong>minimum mass</strong> does not correspond to the pure-He model either, but again to a He-core + H-shell configuration.</p>

  <p>This webpage provides an interactive calculator to predict the minimum, maximum, and pure-He masses and luminosities, including models with such He-core + H-shell structures. Please read the how to use and disclaimers before using the tool. Thank you for reading - enjoy!</p>
