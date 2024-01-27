chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async () => {
        let probNameElement, probName, probNum, solution, formattedSolution,
          fileEx, runtimeText, memoryText, commitMsg, fileName;
        const fileExs = {
          'C++': '.cpp',
          'Java': '.java',
          'Python': '.py',
          'Python3': '.py',
          'C': '.c',
          'C#': '.cs',
          'JavaScript': '.js',
          'TypeScript': '.ts',
          'PHP': '.php',
          'Swift': '.swift',
          'Kotlin': '.kt',
          'Dart': '.dart',
          'Go': '.go',
          'Ruby': '.rb',
          'Scala': '.scala',
          'Rust': '.rs',
          'Racket': '.rkt',
          'Erlang': '.erl',
          'Elixir': '.ex'
        };

        /** get the problem title */
        probNameElement = document.querySelector(
          'div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a'
        );
        probNum = probNameElement.innerText.split('.')[0];
        probName = probNameElement.innerText
          .replace('.', '')
          .replaceAll(' ', '-');

        if (window.location.href.includes('submissions')) {
          /** get the solution & solution lang */
          const solutionLangText = document.querySelector(
            'div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary'
          ).lastChild.nodeValue;
          for (const key in localStorage) {
            if (key.startsWith(`${probNum}_`) && key.endsWith(solutionLangText.toLowerCase())) {
              solution = localStorage.getItem(key);
              formattedSolution = solution
                .replace(/\\n/g, '\n')
                .replace(/  /g, '  ')
                .replace(/"/g, '');
              await sessionStorage.setItem('solution', formattedSolution);
            }
          }
          if (solutionLangText) {
            fileEx = fileExs[solutionLangText];
          }
          fileName = `${probName}${fileEx}`;
          await sessionStorage.setItem('fileName', fileName);

          /** get runtime & memory */
          const [runtime, memory] = document.querySelectorAll(
            'span.font-semibold.text-sd-green-500'
          );
          if (runtime && memory) {
            runtimeText = runtime.innerText;
            memoryText = memory.innerText;
          }

          /** generate commit msg */
          commitMsg = `[${probNum}] [Time Beats ${runtimeText}] [Memory Beats ${memoryText}]`;
          await sessionStorage.setItem('commitMsg', commitMsg);
        }

        /** create push btn */
        const lpDiv = document.createElement('div');
        const lpBtn = document.createElement('button');
        const lpDivStyle = document.createElement('style');
        lpDiv.id = 'leetpush-div';
        lpBtn.id = 'leetpush-btn';
        lpBtn.textContent = 'Push';
        lpBtn.addEventListener('click', () => pushOnClick());
        lpDiv.appendChild(lpBtn);
        document.head.appendChild(lpDivStyle);

        const accepted = document.querySelector(
          'div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.flex.w-full.items-center.justify-between.gap-4 > div.flex.flex-1.flex-col.items-start.gap-1.overflow-hidden > div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span'
        );
        const submissionsPage = window.location.href.includes('submissions');
        const existingLPDiv = document.querySelector('#leetpush-div');
        /** check if the sumbission is accepted or not */
        if (submissionsPage && !existingLPDiv && accepted) {
          const btnParent = document.querySelector(
            'div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)'
          );
          if (btnParent) btnParent.appendChild(lpDiv);
        }

        /** Modal div */
        const modalDiv = document.createElement('div');
        modalDiv.id = 'lp-modal';
        const containerDiv = document.createElement('div');
        containerDiv.id = 'lp-container';
        const h3 = document.createElement('h3');
        h3.textContent = 'Leet';
        const span = document.createElement('span');
        span.textContent = 'Push';
        h3.appendChild(span);
        const form = document.createElement('form');
        form.id = 'lp-form';
        const repoNameDiv = document.createElement('div');
        repoNameDiv.className = 'lp-div';
        const repoNameLabel = document.createElement('label');
        repoNameLabel.textContent = 'Repository URL:';
        const repoNameInput = document.createElement('input');
        repoNameInput.type = 'text';
        repoNameInput.id = 'repo-url';
        repoNameInput.name = 'repo-url';
        repoNameInput.required = true;
        repoNameDiv.appendChild(repoNameLabel);
        repoNameDiv.appendChild(repoNameInput);
        const tokenDiv = document.createElement('div');
        tokenDiv.className = 'lp-div';
        const tokenLabel = document.createElement('label');
        const howToCreateToken = document.createElement('a');
        howToCreateToken.textContent = 'Generate Token?';
        howToCreateToken.href = 'https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig';
        howToCreateToken.setAttribute('target', '_blank');
        tokenLabel.textContent = 'Token:';
        tokenLabel.appendChild(howToCreateToken);
        tokenDiv.appendChild(tokenLabel);
        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.id = 'token';
        tokenInput.name = 'token';
        tokenInput.required = true;
        tokenDiv.appendChild(tokenLabel);
        tokenDiv.appendChild(tokenInput);
        const radioDivMaster = document.createElement('div');
        const radioDivMain = document.createElement('div');
        radioDivMaster.className = 'radio-div';
        radioDivMain.className = 'radio-div';
        const branchDiv = document.createElement('div');
        branchDiv.id = 'lp-radios';
        const masterRadio = document.createElement('input');
        masterRadio.type = 'radio';
        masterRadio.id = 'branch-master';
        masterRadio.name = 'branch-name';
        masterRadio.value = 'master';
        const masterLabel = document.createElement('label');
        masterLabel.textContent = 'master';
        const mainRadio = document.createElement('input');
        mainRadio.type = 'radio';
        mainRadio.id = 'branch-main';
        mainRadio.name = 'branch-name';
        mainRadio.value = 'main';
        const mainLabel = document.createElement('label');
        mainLabel.textContent = 'main';
        branchDiv.appendChild(radioDivMain);
        branchDiv.appendChild(radioDivMaster);
        radioDivMaster.appendChild(masterRadio);
        radioDivMaster.appendChild(masterLabel);
        radioDivMain.appendChild(mainRadio);
        radioDivMain.appendChild(mainLabel);
        const submitBtn = document.createElement('button');
        submitBtn.id = 'lp-submit-btn';
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Submit';
        form.appendChild(repoNameDiv);
        form.appendChild(tokenDiv);
        form.appendChild(branchDiv);
        form.appendChild(submitBtn);
        containerDiv.appendChild(h3);
        containerDiv.appendChild(form);
        modalDiv.appendChild(containerDiv);

        submitBtn.addEventListener('click', (event) => {
          event.preventDefault();

          const repoUrl = document.querySelector('#repo-url').value;
          const token = document.querySelector('#token').value;
          const branch = document.querySelector(
            'input[name="branch-name"]:checked'
          ).value;

          localStorage.setItem('repo', repoUrl);
          localStorage.setItem('token', token);
          localStorage.setItem('branch', branch);

          document.body.removeChild(modalDiv);
        });

        /** push to GitHub */
        async function pushOnClick() {
          console.log('Pushing to Github...');
          const token = localStorage.getItem('token');
          const repo = localStorage.getItem('repo');
          const branch = localStorage.getItem('branch');
          if (!token || !repo || !branch) {
            document.body.appendChild(modalDiv);
            if (token) document.querySelector('#token').value = token;
            if (repo) document.querySelector('#repo-url').value = repo;
            if (branch) document.querySelector(`#branch-${branch}`).checked = true;
            return;
          }

          const [repoName, userName] = repo.split('/').slice(3, 5);

          setTimeout(() => {
            pushToGithub(
              repoName,
              userName,
              branch,
              sessionStorage.getItem('fileName'),
              sessionStorage.getItem('solution'),
              sessionStorage.getItem('commitMsg'),
              token
            );
          }, 1000);
        }

        async function pushToGithub(
          userName,
          repoName,
          branch,
          fileName,
          content,
          commitMsg,
          token
        ) {
          const fileExistsResponse = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (fileExistsResponse.ok) {
            const apiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}`;
            const updateResponse = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                sha: (await fileExistsResponse.json()).sha
              })
            });

            if (!updateResponse.ok) {
              console.error(`Error updating file: ${await updateResponse.json().message}`);
            }

            console.log('File content updated successfully!');
          } else {
            // File doesn't exist, create a new file
            const createResponse = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                branch: branch
              })
            });

            if (!createResponse.ok) {
              console.error(`Error creating file: ${await createResponse.json().message}`);
            }

            console.log('File created successfully!');
          }
        }
      }
    });
  }
});
