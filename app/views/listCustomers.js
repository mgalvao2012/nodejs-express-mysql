// plain functions instead of EJS: EJS compiles with new Function, which Cloudflare Workers forbids
const e = require("./escape.js");

const row = details => `
	<tr>
		<td><a href="/customer/${e(details.id)}">${e(details.name)}</a></td>
		<td>${e(details.email)}</td>
		<td>${e(details.numero_cartao)}</td>
		<td>${e(details.data_expiracao)}</td>
		<td>${e(details.ccv)}</td>
		<td>${e(details.active)}</td>
		<td>${e(details.nome_do_cartao)}</td>
	</tr>`;

module.exports = data => `<h2>Clientes</h2>
<table border="1">
	<tr>
		<td>Nome</td>
		<td>Email</td>
		<td>Cartão</td>
		<td>vencimento</td>
		<td>CCV</td>
		<td>Active</td>
		<td>Nome no cartão</td>
	</tr>${data.map(row).join("")}
</table>`;
