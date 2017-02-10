<ul>
	<#
		console.log(obj['original-data']);
	#>
	<# for ( var i = 0; i < obj.length; i++ ) { #>
	<li>
		<a href="<#=obj[i].url#>">
			<#=obj[i].name#> - <#=obj[i].ctime#> 
		</a>
	</li>
	<# } #>
</ul>
